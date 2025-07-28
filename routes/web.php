<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('HomePage');
})->name('home');

Route::get('/auth', function () {
    return Inertia::render('AuthPage');
})->name('auth');

Route::get('/properties', function () {
    return Inertia::render('PropertiesPage');
})->name('properties');

Route::get('/contact', function () {
    return Inertia::render('ContactFormPage');
})->name('contact');

Route::get('/properties/create', function () {
    return Inertia::render('CreatePropertyPage');
})->name('properties.create');

Route::get('/properties/{id}', function ($id) {
    return Inertia::render('PropertyDetailPage', [
        'id' => $id
    ]);
})->name('properties.show');

Route::get('/bookmarks', function () {
    return Inertia::render('BookmarksPage');
})->name('bookmarks');

Route::get('/profile', function () {
    return Inertia::render('ProfilePage');
})->name('profile');




// Route::middleware(['auth', 'verified'])->group(function () {
//     Route::get('dashboard', function () {
//         return Inertia::render('dashboard');
//     })->name('dashboard');
// });

require __DIR__.'/settings.php';
// require __DIR__.'/auth.php';
// require __DIR__.'/api.php';
