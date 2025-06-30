<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApplicationSubmission extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'application_id',
        'application_type',
        'status',
        
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
        'submitted_at',
        'review_comments',
        'decision_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date_of_birth' => 'date',
        'declaration_date' => 'date',
        'submitted_at' => 'datetime',
        'decision_date' => 'datetime',
        'show_permanent_address' => 'boolean',
        'upload_motivation_note' => 'boolean',
        'has_disability' => 'boolean',
        'declaration_agreed' => 'boolean',
        'all_sections_completed' => 'boolean',
        'all_documents_uploaded' => 'boolean',
        'deposit_slip_attached' => 'boolean',
    ];

    /**
     * Get the user that owns the submission.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the work experiences for this submission.
     */
    public function workExperiences(): HasMany
    {
        return $this->hasMany(SubmissionWorkExperience::class)->orderBy('order_index');
    }

    /**
     * Get the referees for this submission.
     */
    public function referees(): HasMany
    {
        return $this->hasMany(SubmissionReferee::class)->orderBy('order_index');
    }

    /**
     * Generate a unique application ID.
     */
    public static function generateApplicationId(): string
    {
        $year = date('Y');
        $timestamp = time();
        $randomId = str_pad(substr($timestamp, -5), 5, '0', STR_PAD_LEFT);
        
        return "MUST-APP-{$year}-{$randomId}";
    }

    /**
     * Scope for filtering by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope for filtering by application type.
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('application_type', $type);
    }

    /**
     * Get status badge color for UI.
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            'submitted' => 'blue',
            'review' => 'orange',
            'accepted' => 'green',
            'rejected' => 'red',
            default => 'gray',
        };
    }
} 