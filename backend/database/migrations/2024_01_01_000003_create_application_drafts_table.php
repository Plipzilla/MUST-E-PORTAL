<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('application_drafts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Application Type & Progress
            $table->enum('application_type', ['undergraduate', 'postgraduate']);
            $table->integer('current_step')->default(1);
            $table->integer('completion_percentage')->default(0);
            
            // Step 1: Personal Information
            $table->string('title')->nullable();
            $table->string('surname')->nullable();
            $table->string('first_name')->nullable();
            $table->string('marital_status')->nullable();
            $table->string('maiden_name')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('place_of_birth')->nullable();
            $table->string('nationality')->nullable();
            $table->string('country_of_residence')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->string('passport_photo_path')->nullable();
            $table->text('correspondence_address')->nullable();
            $table->string('telephone_numbers')->nullable();
            $table->string('email_address')->nullable();
            $table->text('permanent_address')->nullable();
            $table->boolean('show_permanent_address')->default(false);
            
            // Step 2: Program Information
            $table->enum('level_of_study', ['undergraduate', 'postgraduate'])->nullable();
            $table->string('first_choice')->nullable();
            $table->string('second_choice')->nullable();
            $table->string('third_choice')->nullable();
            $table->string('fourth_choice')->nullable();
            $table->string('method_of_study')->nullable();
            
            // Step 2: Education History
            $table->string('school_name')->nullable();
            $table->string('school_from_date')->nullable();
            $table->string('school_to_date')->nullable();
            $table->text('subjects_studied')->nullable();
            $table->string('examination_year')->nullable();
            $table->string('results_year')->nullable();
            $table->text('grades_achieved')->nullable();
            $table->string('university_college')->nullable();
            $table->string('uni_from_date')->nullable();
            $table->string('uni_to_date')->nullable();
            $table->string('programme')->nullable();
            $table->string('qualification')->nullable();
            $table->string('date_of_award')->nullable();
            $table->string('class_of_award')->nullable();
            
            // Step 3: Motivation (postgraduate only)
            $table->text('motivation_essay')->nullable();
            $table->boolean('upload_motivation_note')->default(false);
            $table->string('motivation_file_path')->nullable();
            
            // Step 4: Special Needs
            $table->boolean('has_disability')->default(false);
            $table->text('disability_description')->nullable();
            
            // Step 5: Declaration
            $table->boolean('declaration_agreed')->default(false);
            $table->string('declaration_full_name')->nullable();
            $table->date('declaration_date')->nullable();
            $table->boolean('all_sections_completed')->default(false);
            $table->boolean('all_documents_uploaded')->default(false);
            $table->boolean('deposit_slip_attached')->default(false);
            
            // Metadata
            $table->string('program_title')->nullable();
            $table->string('faculty')->nullable();
            $table->timestamp('last_saved_at');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'application_type']);
            $table->index('last_saved_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('application_drafts');
    }
}; 