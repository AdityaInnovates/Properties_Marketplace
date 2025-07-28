<?php

use App\Http\Controllers\Api\PropertyController;
use App\Http\Controllers\Api\ProfileController;

// Route::apiResource('properties', PropertyController::class)->only(['index', 'store', 'show']);

Route::get('/properties', [PropertyController::class, 'index']);      // List all properties
Route::post('/properties', [PropertyController::class, 'store']);     // Create new property
Route::get('/properties/{id}', [PropertyController::class, 'show']);

// Profile routes (without auth middleware for Firebase integration)
Route::get('/profile', [ProfileController::class, 'show']);
Route::put('/profile', [ProfileController::class, 'update']);
Route::get('/profile/properties', [ProfileController::class, 'getUserProperties']);