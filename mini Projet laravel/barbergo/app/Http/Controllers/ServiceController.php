<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Hairdresser;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index($hairdresserId)
    {
        $services = Service::where('hairdresser_id', $hairdresserId)->get();

        return response()->json([
            'status' => 200,
            'data' => $services
        ]);
    }

    public function store(Request $request)
    {
        $hairdresser = Hairdresser::where('user_id', $request->user()->id)->firstOrFail();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'duration_minutes' => ['required', 'integer', 'min:1'],
            'gender_target' => ['required', 'string', 'in:male,female,both'],
        ]);

        $service = Service::create([
            'hairdresser_id' => $hairdresser->id,
            'name' => $validated['name'],
            'price' => $validated['price'],
            'duration_minutes' => $validated['duration_minutes'],
            'gender_target' => $validated['gender_target'],
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Service created successfully.',
            'data' => $service
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $hairdresser = Hairdresser::where('user_id', $request->user()->id)->firstOrFail();

        if ($service->hairdresser_id !== $hairdresser->id) {
            return response()->json([
                'status' => 403,
                'error' => 'Forbidden',
                'message' => 'You can only update your own services.'
            ], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'price' => ['sometimes', 'numeric', 'min:0'],
            'duration_minutes' => ['sometimes', 'integer', 'min:1'],
            'gender_target' => ['sometimes', 'string', 'in:male,female,both'],
        ]);

        $service->update($validated);

        return response()->json([
            'status' => 200,
            'message' => 'Service updated successfully.',
            'data' => $service
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $hairdresser = Hairdresser::where('user_id', $request->user()->id)->firstOrFail();

        if ($service->hairdresser_id !== $hairdresser->id) {
            return response()->json([
                'status' => 403,
                'error' => 'Forbidden',
                'message' => 'You can only delete your own services.'
            ], 403);
        }

        $service->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Service deleted successfully.'
        ]);
    }
}
