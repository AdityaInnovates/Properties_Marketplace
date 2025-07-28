<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $email = $request->query('email');
        
        if (!$email) {
            return response()->json(['error' => 'Email parameter is required'], 400);
        }
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $user = User::create([
                'name' => $request->query('name', ''),
                'email' => $email,
                'password' => Hash::make('temporary-password'),
            ]);
        }
        
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'bio' => $user->bio ?? '',
                'phone' => $user->phone ?? '',
                'location' => $user->location ?? '',
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255'],
            'name' => ['required', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'phone' => ['nullable', 'string', 'max:20'],
            'location' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::where('email', $validated['email'])->first();
        
        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'bio' => $user->bio ?? '',
                'phone' => $user->phone ?? '',
                'location' => $user->location ?? '',
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ]
        ]);
    }

    public function getUserProperties(Request $request)
    {
        $email = $request->query('email');
        
        if (!$email) {
            return response()->json(['error' => 'Email parameter is required'], 400);
        }
        
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return response()->json(['success' => true, 'properties' => []]);
        }
        
        $properties = \App\Models\Property::all();
        
        return response()->json([
            'success' => true,
            'properties' => $properties
        ]);
    }
}
