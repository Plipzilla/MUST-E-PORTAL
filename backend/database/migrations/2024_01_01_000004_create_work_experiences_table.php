<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('work_experiences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_draft_id')->constrained()->onDelete('cascade');
            $table->string('from_date');
            $table->string('to_date');
            $table->string('organization');
            $table->string('position');
            $table->integer('order_index')->default(0);
            $table->timestamps();
            
            // Index for performance
            $table->index(['application_draft_id', 'order_index']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('work_experiences');
    }
}; 