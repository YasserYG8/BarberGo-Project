<?php

namespace App\Http\Controllers;

use App\Models\Availability;
use App\Models\Hairdresser;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    public function index($hairdresserId)
    {
        $availabilities = Availability::where('hairdresser_id', $hairdresserId)->get();

        return response()->json([
            'status' => 200,
            'data' => $availabilities
        ]);
    }

    public function store(Request $request)
    {
        $hairdresser = Hairdresser::where('user_id', $request->user()->id)->firstOrFail();

        $validated = $request->validate([
            'day_of_week' => ['required', 'string', 'in:mon,tue,wed,thu,fri,sat,sun'],
            'start_time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i', 'after:start_time'],
        ]);

        $availability = Availability::create([
            'hairdresser_id' => $hairdresser->id,
            'day_of_week' => $validated['day_of_week'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Availability added successfully.',
            'data' => $availability
        ], 201);
    }

    public function destroy(Request $request, $id)
    {
        $availability = Availability::findOrFail($id);
        $hairdresser = Hairdresser::where('user_id', $request->user()->id)->firstOrFail();

        if ($availability->hairdresser_id !== $hairdresser->id) {
            return response()->json([
                'status' => 403,
                'error' => 'Forbidden',
                'message' => 'You can only delete your own availabilities.'
            ], 403);
        }

        $availability->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Availability deleted successfully.'
        ]);
    }
}
