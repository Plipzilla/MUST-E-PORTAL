<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('submission_referees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_submission_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('position');
            $table->string('institution');
            $table->text('address');
            $table->string('email');
            $table->integer('order_index')->default(0);
            $table->timestamps();
            
            // Index for performance
            $table->index(['application_submission_id', 'order_index'], 'sub_referees_idx');
        });
    }

    public function down()
    {
        Schema::dropIfExists('submission_referees');
    }
}; 
