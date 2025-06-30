<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubmissionReferee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'application_submission_id',
        'name',
        'position',
        'institution',
        'address',
        'email',
        'order_index',
    ];

    /**
     * Get the application submission that owns this referee.
     */
    public function applicationSubmission(): BelongsTo
    {
        return $this->belongsTo(ApplicationSubmission::class);
    }
} 