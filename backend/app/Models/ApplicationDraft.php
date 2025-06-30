<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApplicationDraft extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'application_type',
        'current_step',
        'completion_percentage',
        
        // Step 1: Personal Information
        'title',
        'surname',
        'first_name',
        'marital_status',
        'maiden_name',
        'date_of_birth',
        'place_of_birth',
        'nationality',
        'country_of_residence',
        'gender',
        'passport_photo_path',
        'correspondence_address',
        'telephone_numbers',
        'email_address',
        'permanent_address',
        'show_permanent_address',
        
        // Step 2: Program Information
        'level_of_study',
        'first_choice',
        'second_choice',
        'third_choice',
        'fourth_choice',
        'method_of_study',
        
        // Step 2: Education History
        'school_name',
        'school_from_date',
        'school_to_date',
        'subjects_studied',
        'examination_year',
        'results_year',
        'grades_achieved',
        'university_college',
        'uni_from_date',
        'uni_to_date',
        'programme',
        'qualification',
        'date_of_award',
        'class_of_award',
        
        // Step 3: Motivation
        'motivation_essay',
        'upload_motivation_note',
        'motivation_file_path',
        
        // Step 4: Special Needs
        'has_disability',
        'disability_description',
        
        // Step 5: Declaration
        'declaration_agreed',
        'declaration_full_name',
        'declaration_date',
        'all_sections_completed',
        'all_documents_uploaded',
        'deposit_slip_attached',
        
        // Metadata
        'program_title',
        'faculty',
        'last_saved_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'declaration_date' => 'date',
        'last_saved_at' => 'datetime',
        'show_permanent_address' => 'boolean',
        'upload_motivation_note' => 'boolean',
        'has_disability' => 'boolean',
        'declaration_agreed' => 'boolean',
        'all_sections_completed' => 'boolean',
        'all_documents_uploaded' => 'boolean',
        'deposit_slip_attached' => 'boolean',
    ];

    /**
     * Get the user that owns the draft.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the work experiences for this draft.
     */
    public function workExperiences(): HasMany
    {
        return $this->hasMany(WorkExperience::class)->orderBy('order_index');
    }

    /**
     * Get the referees for this draft.
     */
    public function referees(): HasMany
    {
        return $this->hasMany(Referee::class)->orderBy('order_index');
    }

    /**
     * Calculate completion percentage based on filled fields.
     */
    public function calculateCompletionPercentage(): int
    {
        $completionPercentage = 0;
        
        // Application type selected (20%)
        if ($this->application_type) {
            $completionPercentage += 20;
        }
        
        // Basic personal info (20%)
        if ($this->first_name && $this->surname && $this->email_address) {
            $completionPercentage += 20;
        }
        
        // Program selected (20%)
        if ($this->first_choice) {
            $completionPercentage += 20;
        }
        
        // Motivation for postgraduate (20%)
        if ($this->application_type === 'postgraduate' && $this->motivation_essay) {
            $completionPercentage += 20;
        } elseif ($this->application_type === 'undergraduate') {
            $completionPercentage += 20; // Skip motivation for undergraduate
        }
        
        // At least one referee (20%)
        if ($this->referees()->whereNotNull('name')->whereNotNull('email')->exists()) {
            $completionPercentage += 20;
        }
        
        return $completionPercentage;
    }

    /**
     * Update completion percentage and save.
     */
    public function updateCompletionPercentage(): void
    {
        $this->completion_percentage = $this->calculateCompletionPercentage();
        $this->last_saved_at = now();
        $this->save();
    }

    /**
     * Get faculty from program name.
     */
    public function getFacultyFromProgram(string $programName): string
    {
        $facultyMap = [
            // Engineering programs
            'Civil Engineering' => 'Engineering',
            'Mechanical Engineering' => 'Engineering',
            'Electrical Engineering' => 'Engineering',
            'Electronic Engineering' => 'Engineering',
            'Chemical Engineering' => 'Engineering',
            
            // Applied Sciences programs
            'Computer Science' => 'Applied Sciences',
            'Information Technology' => 'Applied Sciences',
            'Mathematics' => 'Applied Sciences',
            'Statistics' => 'Applied Sciences',
            'Chemistry' => 'Applied Sciences',
            'Physics' => 'Applied Sciences',
            'Biological Sciences' => 'Applied Sciences',
            
            // Health Sciences programs
            'Medicine' => 'Health Sciences',
            'Nursing' => 'Health Sciences',
            'Pharmacy' => 'Health Sciences',
            'Public Health' => 'Health Sciences',
            'Biomedical Sciences' => 'Health Sciences',
            
            // Business programs
            'Business Administration' => 'Business',
            'Accounting' => 'Business',
            'Economics' => 'Business',
            'Finance' => 'Business',
            'Marketing' => 'Business',
        ];

        return $facultyMap[$programName] ?? 'Other';
    }

    /**
     * Convert to array format similar to React application data structure.
     */
    public function toApplicationData(): array
    {
        return [
            'step1' => [
                'applicationType' => $this->application_type,
                'title' => $this->title,
                'surname' => $this->surname,
                'firstName' => $this->first_name,
                'maritalStatus' => $this->marital_status,
                'maidenName' => $this->maiden_name,
                'dateOfBirth' => $this->date_of_birth?->format('Y-m-d'),
                'placeOfBirth' => $this->place_of_birth,
                'nationality' => $this->nationality,
                'countryOfResidence' => $this->country_of_residence,
                'gender' => $this->gender,
                'passportPhoto' => null, // File handling separate
                'correspondenceAddress' => $this->correspondence_address,
                'telephoneNumbers' => $this->telephone_numbers,
                'emailAddress' => $this->email_address,
                'permanentAddress' => $this->permanent_address,
                'showPermanentAddress' => $this->show_permanent_address,
            ],
            'step2' => [
                'programInfo' => [
                    'levelOfStudy' => $this->level_of_study,
                    'firstChoice' => $this->first_choice,
                    'secondChoice' => $this->second_choice,
                    'thirdChoice' => $this->third_choice,
                    'fourthChoice' => $this->fourth_choice,
                    'methodOfStudy' => $this->method_of_study,
                ],
                'educationHistory' => [
                    'schoolName' => $this->school_name,
                    'schoolFromDate' => $this->school_from_date,
                    'schoolToDate' => $this->school_to_date,
                    'subjectsStudied' => $this->subjects_studied,
                    'examinationYear' => $this->examination_year,
                    'resultsYear' => $this->results_year,
                    'gradesAchieved' => $this->grades_achieved,
                    'universityCollege' => $this->university_college,
                    'uniFromDate' => $this->uni_from_date,
                    'uniToDate' => $this->uni_to_date,
                    'programme' => $this->programme,
                    'qualification' => $this->qualification,
                    'dateOfAward' => $this->date_of_award,
                    'classOfAward' => $this->class_of_award,
                ],
            ],
            'step3' => [
                'workExperience' => $this->workExperiences->map(function($exp) {
                    return [
                        'fromDate' => $exp->from_date,
                        'toDate' => $exp->to_date,
                        'organization' => $exp->organization,
                        'position' => $exp->position,
                    ];
                })->toArray(),
                'motivation' => [
                    'motivationEssay' => $this->motivation_essay,
                    'uploadMotivationNote' => $this->upload_motivation_note,
                    'motivationFile' => null, // File handling separate
                ],
            ],
            'step4' => [
                'hasDisability' => $this->has_disability,
                'disabilityDescription' => $this->disability_description,
            ],
            'step5' => [
                'referees' => $this->referees->map(function($ref) {
                    return [
                        'name' => $ref->name,
                        'position' => $ref->position,
                        'institution' => $ref->institution,
                        'address' => $ref->address,
                        'email' => $ref->email,
                    ];
                })->toArray(),
                'declaration' => [
                    'declarationAgreed' => $this->declaration_agreed,
                    'fullName' => $this->declaration_full_name,
                    'date' => $this->declaration_date?->format('Y-m-d'),
                    'allSectionsCompleted' => $this->all_sections_completed,
                    'allDocumentsUploaded' => $this->all_documents_uploaded,
                    'depositSlipAttached' => $this->deposit_slip_attached,
                ],
            ],
            'currentStep' => $this->current_step,
            'lastSaved' => $this->last_saved_at?->toISOString(),
        ];
    }
} 