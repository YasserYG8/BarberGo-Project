<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Hairdresser;
use App\Models\Booking;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard()
    {
        $totalSales = Booking::where('status', 'done')->sum('total');
        
        $stats = [
            'total_users' => User::count(),
            'total_hairdressers' => Hairdresser::count(),
            'total_bookings' => Booking::count(),
            'pending_validations' => Hairdresser::where('is_validated', false)->count(),
            'total_sales' => $totalSales,
            'platform_profit' => $totalSales * 0.135, // 13.5% commission
        ];

        return response()->json([
            'status' => 200,
            'data' => $stats
        ]);
    }

    public function hairdressers()
    {
        $hairdressers = Hairdresser::with('user')->get();

        return response()->json([
            'status' => 200,
            'data' => $hairdressers
        ]);
    }

    public function validateHairdresser($id)
    {
        $hairdresser = Hairdresser::with('user')->findOrFail($id);
        $hairdresser->update(['is_validated' => true]);

        // Send notification to the user
        $hairdresser->user->notify(new \App\Notifications\AccountValidated());

        return response()->json([
            'status' => 200,
            'message' => 'Hairdresser validated successfully.',
            'data' => $hairdresser
        ]);
    }

    public function rejectHairdresser($id)
    {
        $hairdresser = Hairdresser::with('user')->findOrFail($id);
        $user = $hairdresser->user;

        // Send rejection notification
        $user->notify(new \App\Notifications\AccountRejected());

        // Delete the hairdresser profile
        $hairdresser->delete();

        // Optionally change role back to client
        if ($user->role->value === 'hairdresser') {
            $user->update(['role' => 'client']);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Hairdresser rejected successfully.',
        ]);
    }

    public function bookings()
    {
        $bookings = Booking::with(['client', 'hairdresser.user', 'services'])->get();

        return response()->json([
            'status' => 200,
            'data' => $bookings
        ]);
    }

    public function users()
    {
        $users = User::all();

        return response()->json([
            'status' => 200,
            'data' => $users
        ]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json([
            'status' => 200,
            'message' => 'User deleted successfully.'
        ]);
    }

    public function updateRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:admin,hairdresser,client',
        ]);

        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);

        return response()->json([
            'status' => 200,
            'message' => 'Role updated successfully.',
            'data' => $user
        ]);
    }
}
