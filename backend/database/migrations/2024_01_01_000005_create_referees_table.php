<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('referees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_draft_id')->constrained()->onDelete('cascade');
            $table->string('name')->nullable();
            $table->string('position')->nullable();
            $table->string('institution')->nullable();
            $table->text('address')->nullable();
            $table->string('email')->nullable();
            $table->integer('order_index')->default(0);
            $table->timestamps();
            
            // Index for performance
            $table->index(['application_draft_id', 'order_index']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('referees');
    }
}; 