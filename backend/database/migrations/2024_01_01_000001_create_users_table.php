<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password')->nullable(); // Nullable for social login users
            
            // Social login fields
            $table->string('provider')->nullable(); // google, facebook, email
            $table->string('provider_id')->nullable();
            $table->string('avatar')->nullable();
            
            // Session management
            $table->timestamp('last_activity_at')->nullable();
            $table->integer('session_timeout')->default(1800); // 30 minutes in seconds
            
            $table->rememberToken();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['provider', 'provider_id']);
            $table->index('email');
            $table->index('last_activity_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}; 