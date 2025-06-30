<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Referee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'application_draft_id',
        'name',
        'position',
        'institution',
        'address',
        'email',
        'order_index',
    ];

    /**
     * Get the application draft that owns this referee.
     */
    public function applicationDraft(): BelongsTo
    {
        return $this->belongsTo(ApplicationDraft::class);
    }
} 