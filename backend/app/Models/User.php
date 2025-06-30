<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'provider',
        'provider_id',
        'avatar',
        'last_activity_at',
        'session_timeout',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_activity_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the user's application drafts.
     */
    public function applicationDrafts(): HasMany
    {
        return $this->hasMany(ApplicationDraft::class);
    }

    /**
     * Get the user's submitted applications.
     */
    public function applicationSubmissions(): HasMany
    {
        return $this->hasMany(ApplicationSubmission::class);
    }

    /**
     * Get the user's current draft (only one allowed per user).
     */
    public function currentDraft()
    {
        return $this->applicationDrafts()->latest('last_saved_at')->first();
    }

    /**
     * Check if user has admin role.
     */
    public function isAdmin(): bool
    {
        return $this->hasRole('admin');
    }



    /**
     * Update user's last activity timestamp.
     */
    public function updateLastActivity(): void
    {
        $this->update(['last_activity_at' => now()]);
    }

    /**
     * Check if user's session has expired.
     */
    public function isSessionExpired(): bool
    {
        if (!$this->last_activity_at) {
            return true;
        }

        return $this->last_activity_at->addSeconds($this->session_timeout)->isPast();
    }

    /**
     * Get user claims for token response.
     */
    public function getClaims(): array
    {
        return [
            'admin' => $this->isAdmin(),
            'roles' => $this->roles->pluck('name')->toArray(),
        ];
    }
} 