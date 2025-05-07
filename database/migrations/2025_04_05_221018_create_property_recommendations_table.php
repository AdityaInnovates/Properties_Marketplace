<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePropertyRecommendationsTable extends Migration
{
    public function up()
    {
        Schema::create('property_recommendations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('property_id');
            $table->jsonb('recommendations');
            $table->timestamps();

            $table->foreign('property_id')
                  ->references('id')
                  ->on('properties')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('property_recommendations');
    }
}