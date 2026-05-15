<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Models\User;
use App\Models\Hairdresser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    /**
     * POST /api/auth/register
     * Registers a new user (client or hairdresser).
     * If hairdresser, creates a hairdresser profile automatically.
     */
    public function register(RegisterRequest $request)
    {
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
            'phone'    => $request->phone,
            'address'  => $request->address,
            'gender'   => $request->gender,
        ]);

        // If user is a hairdresser, create the hairdresser profile
        if ($user->role->value === 'hairdresser') {
            Hairdresser::create([
                'user_id' => $user->id,
            ]);
        }

        if ($user->role->value === 'hairdresser') {
            $user->load('hairdresser');
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status'       => 201,
            'message'      => 'User registered successfully.',
            'data'         => $user,
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ], 201);
    }

    /**
     * POST /api/auth/login
     * Authenticates a user and returns a Sanctum token.
     */
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status'  => 401,
                'error'   => 'Unauthorized',
                'message' => 'Invalid credentials.',
            ], 401);
        }

        // Revoke old tokens for clean sessions
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        if ($user->role->value === 'hairdresser') {
            $user->load('hairdresser');
        }

        return response()->json([
            'status'       => 200,
            'message'      => 'Logged in successfully.',
            'data'         => $user,
            'access_token' => $token,
            'token_type'   => 'Bearer',
        ]);
    }

    /**
     * POST /api/auth/logout
     * Revokes the current Sanctum token.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status'  => 200,
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * GET /api/auth/me
     * Returns the authenticated user's profile.
     */
    public function me(Request $request)
    {
        $user = $request->user();
        
        if ($user->role->value === 'hairdresser') {
            $user->load('hairdresser');
        }

        return response()->json([
            'status' => 200,
            'data'   => $user,
        ]);
    }

    /**
     * PUT /api/auth/me
     * Updates the authenticated user's profile fields.
     */
    public function updateMe(Request $request)
    {
        $validated = $request->validate([
            'name'    => ['sometimes', 'string', 'min:2', 'max:255'],
            'phone'   => ['sometimes', 'nullable', 'string', 'max:30'],
            'address' => ['sometimes', 'nullable', 'string', 'max:500'],
        ]);

        $request->user()->update($validated);

        return response()->json([
            'status'  => 200,
            'message' => 'Profile updated successfully.',
            'data'    => $request->user()->fresh(),
        ]);
    }

    /**
     * POST /api/auth/profile-picture
     * Uploads a profile picture for the authenticated user.
     */
    public function uploadProfilePicture(Request $request)
    {
        $request->validate([
            'file' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        $user = $request->user();

        // Delete old avatar file if it exists
        if ($user->avatar) {
            $oldPath = str_replace('/storage/', '', $user->avatar);
            Storage::disk('public')->delete($oldPath);
        }

        // Store the new avatar
        $path = $request->file('file')->store('avatars', 'public');
        $publicUrl = '/storage/' . $path;

        $user->update(['avatar' => $publicUrl]);

        return response()->json([
            'status' => 200,
            'message' => 'Profile picture updated successfully.',
            'data' => [
                'avatar' => $publicUrl,
            ],
        ]);
    }

    /**
     * POST /api/auth/send-verification-email
     * Sends a verification email to the authenticated user.
     */
    public function sendVerificationEmail(Request $request)
    {
        $user = $request->user();

        if ($user->email_verified_at) {
            return response()->json([
                'status' => 200,
                'message' => 'Email is already verified.',
            ]);
        }

        // Generate a signed URL for verification
        $verificationUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'verification.verify',
            now()->addMinutes(60),
            ['id' => $user->id, 'hash' => sha1($user->email)]
        );

        // Send email
        $user->notify(new \App\Notifications\VerifyEmailNotification($verificationUrl));

        return response()->json([
            'status' => 200,
            'message' => 'Verification email sent successfully.',
        ]);
    }

    /**
     * GET /api/auth/verify-email/{id}/{hash}
     * Verifies the user's email address.
     */
    public function verifyEmail(Request $request, $id, $hash)
    {
        $user = \App\Models\User::findOrFail($id);

        if (! hash_equals(sha1($user->email), $hash)) {
            return response()->json([
                'status' => 403,
                'message' => 'Invalid verification link.',
            ], 403);
        }

        $role = $user->role->value ?? $user->role;
        $baseUrl = 'http://localhost:3000';
        $redirectPath = match($role) {
            'hairdresser' => '/hairdresser/profile',
            'admin' => '/admin',
            default => '/client/profile'
        };

        if ($user->email_verified_at) {
            return redirect($baseUrl . $redirectPath . '?verified=already');
        }

        $user->update(['email_verified_at' => now()]);

        return redirect($baseUrl . $redirectPath . '?verified=1');
    }
}
