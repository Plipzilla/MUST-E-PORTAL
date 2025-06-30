<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('application_submissions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('application_id')->unique(); // MUST-APP-YYYY-XXXXX format
            
            // Application Type & Status
            $table->enum('application_type', ['undergraduate', 'postgraduate']);
            $table->enum('status', ['submitted', 'review', 'accepted', 'rejected'])->default('submitted');
            
            // Step 1: Personal Information
            $table->string('title');
            $table->string('surname');
            $table->string('first_name');
            $table->string('marital_status');
            $table->string('maiden_name')->nullable();
            $table->date('date_of_birth');
            $table->string('place_of_birth');
            $table->string('nationality');
            $table->string('country_of_residence');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->string('passport_photo_path')->nullable();
            $table->text('correspondence_address');
            $table->string('telephone_numbers');
            $table->string('email_address');
            $table->text('permanent_address')->nullable();
            $table->boolean('show_permanent_address')->default(false);
            
            // Step 2: Program Information
            $table->enum('level_of_study', ['undergraduate', 'postgraduate']);
            $table->string('first_choice');
            $table->string('second_choice')->nullable();
            $table->string('third_choice')->nullable();
            $table->string('fourth_choice')->nullable();
            $table->string('method_of_study');
            
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
            $table->boolean('declaration_agreed')->default(true);
            $table->string('declaration_full_name');
            $table->date('declaration_date');
            $table->boolean('all_sections_completed')->default(true);
            $table->boolean('all_documents_uploaded')->default(true);
            $table->boolean('deposit_slip_attached')->default(true);
            
            // Metadata
            $table->string('program_title');
            $table->string('faculty');
            $table->timestamp('submitted_at');
            $table->text('review_comments')->nullable();
            $table->timestamp('decision_date')->nullable();
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'status']);
            $table->index(['application_type', 'status']);
            $table->index('submitted_at');
            $table->index('application_id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('application_submissions');
    }
}; 