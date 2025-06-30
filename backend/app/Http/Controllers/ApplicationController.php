<?php

namespace App\Http\Controllers;

use App\Models\ApplicationDraft;
use App\Models\ApplicationSubmission;
use App\Models\WorkExperience;
use App\Models\Referee;
use App\Models\SubmissionWorkExperience;
use App\Models\SubmissionReferee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ApplicationController extends Controller
{
    /**
     * Save or update application draft.
     */
    public function saveDraft(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            // Find or create draft for user
            $draft = ApplicationDraft::where('user_id', $user->id)->first();
            
            if (!$draft) {
                $draft = new ApplicationDraft(['user_id' => $user->id]);
            }

            // Update draft fields from request
            $this->updateDraftFromRequest($draft, $request->all());
            
            // Calculate and update completion percentage
            $draft->updateCompletionPercentage();

            return response()->json([
                'success' => true,
                'message' => 'Draft saved successfully',
                'data' => [
                    'draft_id' => $draft->id,
                    'completion_percentage' => $draft->completion_percentage,
                    'last_saved' => $draft->last_saved_at->toISOString(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save draft. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Load user's draft.
     */
    public function loadDraft(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            $draft = ApplicationDraft::with(['workExperiences', 'referees'])
                ->where('user_id', $user->id)
                ->first();

            if (!$draft) {
                return response()->json([
                    'success' => true,
                    'message' => 'No draft found',
                    'data' => null,
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Draft loaded successfully',
                'data' => $draft->toApplicationData(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load draft',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Submit final application.
     */
    public function submitApplication(Request $request): JsonResponse
    {
        try {
            DB::beginTransaction();

            $user = $request->user();
            $user->updateLastActivity();

            // Get user's draft
            $draft = ApplicationDraft::with(['workExperiences', 'referees'])
                ->where('user_id', $user->id)
                ->first();

            if (!$draft) {
                return response()->json([
                    'success' => false,
                    'message' => 'No draft found to submit',
                ], 404);
            }

            // Validate completion
            if ($draft->completion_percentage < 100) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please complete all required fields before submitting',
                    'completion_percentage' => $draft->completion_percentage,
                ], 422);
            }

            // Create application submission
            $submission = ApplicationSubmission::create([
                'user_id' => $user->id,
                'application_id' => ApplicationSubmission::generateApplicationId(),
                'application_type' => $draft->application_type,
                'status' => 'submitted',
                
                // Copy all fields from draft
                'title' => $draft->title,
                'surname' => $draft->surname,
                'first_name' => $draft->first_name,
                'marital_status' => $draft->marital_status,
                'maiden_name' => $draft->maiden_name,
                'date_of_birth' => $draft->date_of_birth,
                'place_of_birth' => $draft->place_of_birth,
                'nationality' => $draft->nationality,
                'country_of_residence' => $draft->country_of_residence,
                'gender' => $draft->gender,
                'passport_photo_path' => $draft->passport_photo_path,
                'correspondence_address' => $draft->correspondence_address,
                'telephone_numbers' => $draft->telephone_numbers,
                'email_address' => $draft->email_address,
                'permanent_address' => $draft->permanent_address,
                'show_permanent_address' => $draft->show_permanent_address,
                
                'level_of_study' => $draft->level_of_study,
                'first_choice' => $draft->first_choice,
                'second_choice' => $draft->second_choice,
                'third_choice' => $draft->third_choice,
                'fourth_choice' => $draft->fourth_choice,
                'method_of_study' => $draft->method_of_study,
                
                'school_name' => $draft->school_name,
                'school_from_date' => $draft->school_from_date,
                'school_to_date' => $draft->school_to_date,
                'subjects_studied' => $draft->subjects_studied,
                'examination_year' => $draft->examination_year,
                'results_year' => $draft->results_year,
                'grades_achieved' => $draft->grades_achieved,
                'university_college' => $draft->university_college,
                'uni_from_date' => $draft->uni_from_date,
                'uni_to_date' => $draft->uni_to_date,
                'programme' => $draft->programme,
                'qualification' => $draft->qualification,
                'date_of_award' => $draft->date_of_award,
                'class_of_award' => $draft->class_of_award,
                
                'motivation_essay' => $draft->motivation_essay,
                'upload_motivation_note' => $draft->upload_motivation_note,
                'motivation_file_path' => $draft->motivation_file_path,
                
                'has_disability' => $draft->has_disability,
                'disability_description' => $draft->disability_description,
                
                'declaration_agreed' => $draft->declaration_agreed,
                'declaration_full_name' => $draft->declaration_full_name,
                'declaration_date' => $draft->declaration_date,
                'all_sections_completed' => $draft->all_sections_completed,
                'all_documents_uploaded' => $draft->all_documents_uploaded,
                'deposit_slip_attached' => $draft->deposit_slip_attached,
                
                'program_title' => $draft->program_title ?: $draft->first_choice,
                'faculty' => $draft->faculty ?: $draft->getFacultyFromProgram($draft->first_choice),
                'submitted_at' => now(),
            ]);

            // Copy work experiences
            foreach ($draft->workExperiences as $workExp) {
                SubmissionWorkExperience::create([
                    'application_submission_id' => $submission->id,
                    'from_date' => $workExp->from_date,
                    'to_date' => $workExp->to_date,
                    'organization' => $workExp->organization,
                    'position' => $workExp->position,
                    'order_index' => $workExp->order_index,
                ]);
            }

            // Copy referees
            foreach ($draft->referees as $referee) {
                SubmissionReferee::create([
                    'application_submission_id' => $submission->id,
                    'name' => $referee->name,
                    'position' => $referee->position,
                    'institution' => $referee->institution,
                    'address' => $referee->address,
                    'email' => $referee->email,
                    'order_index' => $referee->order_index,
                ]);
            }

            // Delete the draft after successful submission
            $draft->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Application submitted successfully',
                'data' => [
                    'application_id' => $submission->application_id,
                    'submission_id' => $submission->id,
                    'status' => $submission->status,
                    'submitted_at' => $submission->submitted_at->toISOString(),
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit application. Please try again.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's applications (drafts and submissions).
     */
    public function getUserApplications(Request $request): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            // Get drafts
            $drafts = ApplicationDraft::where('user_id', $user->id)->get();
            
            // Get submissions
            $submissions = ApplicationSubmission::where('user_id', $user->id)
                ->orderBy('submitted_at', 'desc')
                ->get();

            $applications = [];

            // Format drafts
            foreach ($drafts as $draft) {
                $applications[] = [
                    'id' => "draft_{$draft->id}",
                    'title' => $draft->program_title ?: 'Application Draft',
                    'faculty' => $draft->faculty ?: 'Not specified',
                    'status' => $draft->completion_percentage < 100 ? 'incomplete' : 'draft',
                    'submitted_date' => '',
                    'last_updated' => $draft->last_saved_at->format('Y-m-d'),
                    'application_id' => "DRAFT-{$draft->id}",
                    'is_draft' => true,
                    'completion_percentage' => $draft->completion_percentage,
                ];
            }

            // Format submissions
            foreach ($submissions as $submission) {
                $applications[] = [
                    'id' => $submission->id,
                    'title' => $submission->program_title,
                    'faculty' => $submission->faculty,
                    'status' => $submission->status,
                    'submitted_date' => $submission->submitted_at->format('Y-m-d'),
                    'last_updated' => $submission->updated_at->format('Y-m-d'),
                    'application_id' => $submission->application_id,
                    'is_draft' => false,
                ];
            }

            return response()->json([
                'success' => true,
                'message' => 'Applications retrieved successfully',
                'data' => $applications,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve applications',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get specific application details.
     */
    public function getApplication(Request $request, $id): JsonResponse
    {
        try {
            $user = $request->user();
            $user->updateLastActivity();

            // Check if it's a draft or submission
            if (str_starts_with($id, 'draft_')) {
                $draftId = str_replace('draft_', '', $id);
                $draft = ApplicationDraft::with(['workExperiences', 'referees'])
                    ->where('id', $draftId)
                    ->where('user_id', $user->id)
                    ->first();

                if (!$draft) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Draft not found',
                    ], 404);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Draft retrieved successfully',
                    'data' => $draft->toApplicationData(),
                ]);
            } else {
                $submission = ApplicationSubmission::with(['workExperiences', 'referees'])
                    ->where('id', $id)
                    ->where('user_id', $user->id)
                    ->first();

                if (!$submission) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Application not found',
                    ], 404);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Application retrieved successfully',
                    'data' => $submission,
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve application',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update draft fields from request data.
     */
    private function updateDraftFromRequest(ApplicationDraft $draft, array $data): void
    {
        // Map React field names to database field names and update
        $fieldMapping = [
            // Step 1: Personal Information
            'step1.applicationType' => 'application_type',
            'step1.title' => 'title',
            'step1.surname' => 'surname',
            'step1.firstName' => 'first_name',
            'step1.maritalStatus' => 'marital_status',
            'step1.maidenName' => 'maiden_name',
            'step1.dateOfBirth' => 'date_of_birth',
            'step1.placeOfBirth' => 'place_of_birth',
            'step1.nationality' => 'nationality',
            'step1.countryOfResidence' => 'country_of_residence',
            'step1.gender' => 'gender',
            'step1.correspondenceAddress' => 'correspondence_address',
            'step1.telephoneNumbers' => 'telephone_numbers',
            'step1.emailAddress' => 'email_address',
            'step1.permanentAddress' => 'permanent_address',
            'step1.showPermanentAddress' => 'show_permanent_address',
            
            // Step 2: Program Information
            'step2.programInfo.levelOfStudy' => 'level_of_study',
            'step2.programInfo.firstChoice' => 'first_choice',
            'step2.programInfo.secondChoice' => 'second_choice',
            'step2.programInfo.thirdChoice' => 'third_choice',
            'step2.programInfo.fourthChoice' => 'fourth_choice',
            'step2.programInfo.methodOfStudy' => 'method_of_study',
            
            // Step 2: Education History
            'step2.educationHistory.schoolName' => 'school_name',
            'step2.educationHistory.schoolFromDate' => 'school_from_date',
            'step2.educationHistory.schoolToDate' => 'school_to_date',
            'step2.educationHistory.subjectsStudied' => 'subjects_studied',
            'step2.educationHistory.examinationYear' => 'examination_year',
            'step2.educationHistory.resultsYear' => 'results_year',
            'step2.educationHistory.gradesAchieved' => 'grades_achieved',
            'step2.educationHistory.universityCollege' => 'university_college',
            'step2.educationHistory.uniFromDate' => 'uni_from_date',
            'step2.educationHistory.uniToDate' => 'uni_to_date',
            'step2.educationHistory.programme' => 'programme',
            'step2.educationHistory.qualification' => 'qualification',
            'step2.educationHistory.dateOfAward' => 'date_of_award',
            'step2.educationHistory.classOfAward' => 'class_of_award',
            
            // Step 3: Motivation
            'step3.motivation.motivationEssay' => 'motivation_essay',
            'step3.motivation.uploadMotivationNote' => 'upload_motivation_note',
            
            // Step 4: Special Needs
            'step4.hasDisability' => 'has_disability',
            'step4.disabilityDescription' => 'disability_description',
            
            // Step 5: Declaration
            'step5.declaration.declarationAgreed' => 'declaration_agreed',
            'step5.declaration.fullName' => 'declaration_full_name',
            'step5.declaration.date' => 'declaration_date',
            'step5.declaration.allSectionsCompleted' => 'all_sections_completed',
            'step5.declaration.allDocumentsUploaded' => 'all_documents_uploaded',
            'step5.declaration.depositSlipAttached' => 'deposit_slip_attached',
            
            // Metadata
            'currentStep' => 'current_step',
            'programTitle' => 'program_title',
            'faculty' => 'faculty',
        ];

        // Update simple fields
        foreach ($fieldMapping as $requestKey => $dbField) {
            $value = data_get($data, $requestKey);
            if ($value !== null) {
                $draft->$dbField = $value;
            }
        }

        // Set program title and faculty if first choice is set
        if (isset($data['step2']['programInfo']['firstChoice'])) {
            $draft->program_title = $data['step2']['programInfo']['firstChoice'];
            $draft->faculty = $draft->getFacultyFromProgram($data['step2']['programInfo']['firstChoice']);
        }

        $draft->last_saved_at = now();
        $draft->save();

        // Handle work experiences
        if (isset($data['step3']['workExperience'])) {
            // Delete existing work experiences
            $draft->workExperiences()->delete();
            
            // Create new work experiences
            foreach ($data['step3']['workExperience'] as $index => $workExp) {
                if (!empty($workExp['organization']) || !empty($workExp['position'])) {
                    WorkExperience::create([
                        'application_draft_id' => $draft->id,
                        'from_date' => $workExp['fromDate'] ?? '',
                        'to_date' => $workExp['toDate'] ?? '',
                        'organization' => $workExp['organization'] ?? '',
                        'position' => $workExp['position'] ?? '',
                        'order_index' => $index,
                    ]);
                }
            }
        }

        // Handle referees
        if (isset($data['step5']['referees'])) {
            // Delete existing referees
            $draft->referees()->delete();
            
            // Create new referees
            foreach ($data['step5']['referees'] as $index => $referee) {
                if (!empty($referee['name']) || !empty($referee['email'])) {
                    Referee::create([
                        'application_draft_id' => $draft->id,
                        'name' => $referee['name'] ?? '',
                        'position' => $referee['position'] ?? '',
                        'institution' => $referee['institution'] ?? '',
                        'address' => $referee['address'] ?? '',
                        'email' => $referee['email'] ?? '',
                        'order_index' => $index,
                    ]);
                }
            }
        }
    }
} 