<?php

namespace App\Http\Controllers;

use App\Models\Hairdresser;
use Illuminate\Http\Request;

class HairdresserController extends Controller
{
    /**
     * GET /api/hairdressers — Public list of validated hairdressers.
     */
    public function index()
    {
        $hairdressers = Hairdresser::with(['user', 'services'])
            ->where('is_validated', true)
            ->get();

        return response()->json([
            'status' => 200,
            'data'   => $hairdressers
        ]);
    }

    /**
     * GET /api/hairdressers/{id} — Public hairdresser profile.
     */
    public function show($id)
    {
        $hairdresser = Hairdresser::with(['user', 'services', 'availabilities', 'reviews.client'])
            ->findOrFail($id);

        return response()->json([
            'status' => 200,
            'data'   => $hairdresser
        ]);
    }

    /**
     * GET /api/hairdressers/me — Own hairdresser profile (HAIRDRESSER only).
     * IMPORTANT: This route is registered BEFORE /{id} to avoid wildcard conflict.
     */
    public function me(Request $request)
    {
        $hairdresser = Hairdresser::with(['user', 'services', 'availabilities'])
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        return response()->json([
            'status' => 200,
            'data'   => $hairdresser
        ]);
    }

    /**
     * PUT /api/hairdressers/update — Update own profile (HAIRDRESSER only).
     * Uses the authenticated user's hairdresser record directly.
     */
    public function updateMe(Request $request)
    {
        $hairdresser = Hairdresser::where('user_id', $request->user()->id)->firstOrFail();

        $validated = $request->validate([
            'bio'   => ['nullable', 'string'],
            'photo' => ['nullable', 'string'],
        ]);

        $hairdresser->update($validated);

        return response()->json([
            'status'  => 200,
            'message' => 'Profile updated successfully.',
            'data'    => $hairdresser->fresh(['user', 'services', 'availabilities'])
        ]);
    }

    /**
     * PUT /api/hairdressers/{id} — Update hairdresser by ID (ownership check).
     */
    public function update(Request $request, $id)
    {
        $hairdresser = Hairdresser::findOrFail($id);

        // Ensure the authenticated user owns this profile
        if ($hairdresser->user_id !== $request->user()->id) {
            return response()->json([
                'status'  => 403,
                'error'   => 'Forbidden',
                'message' => 'You can only update your own profile.'
            ], 403);
        }

        $validated = $request->validate([
            'bio'   => ['nullable', 'string'],
            'photo' => ['nullable', 'string'],
        ]);

        $hairdresser->update($validated);

        return response()->json([
            'status'  => 200,
            'message' => 'Profile updated successfully.',
            'data'    => $hairdresser
        ]);
    }
}
