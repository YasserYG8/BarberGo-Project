<?php

namespace App\Http\Controllers;

use App\Http\Requests\BookingRequest;
use App\Models\Booking;
use App\Models\Hairdresser;
use App\Services\BookingService;
use App\Services\NotificationService;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    protected $bookingService;
    protected $notificationService;

    public function __construct(BookingService $bookingService, NotificationService $notificationService)
    {
        $this->bookingService = $bookingService;
        $this->notificationService = $notificationService;
    }

    public function store(BookingRequest $request)
    {
        $booking = $this->bookingService->createBooking($request->validated(), $request->user()->id);

        // Notify the hairdresser about the new booking
        $this->notificationService->sendNewBookingNotification($booking);

        return response()->json([
            'status' => 201,
            'message' => 'Booking created successfully.',
            'data' => $booking->load('services', 'hairdresser.user')
        ], 201);
    }

    public function myBookings(Request $request)
    {
        $user = $request->user();
        
        if ($user->role->value === 'client') {
            $bookings = Booking::where('client_id', $user->id)
                ->with(['hairdresser.user', 'services'])
                ->orderBy('booking_date', 'desc')
                ->get();
        } else if ($user->role->value === 'hairdresser') {
            $hairdresser = Hairdresser::where('user_id', $user->id)->firstOrFail();
            $bookings = Booking::where('hairdresser_id', $hairdresser->id)
                ->with(['client', 'services'])
                ->orderBy('booking_date', 'desc')
                ->get();
        } else {
            $bookings = [];
        }

        return response()->json([
            'status' => 200,
            'data' => $bookings
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);
        $hairdresser = Hairdresser::where('user_id', $request->user()->id)->firstOrFail();

        if ($booking->hairdresser_id !== $hairdresser->id) {
            return response()->json([
                'status' => 403,
                'error' => 'Forbidden',
                'message' => 'You can only update status of your own bookings.'
            ], 403);
        }

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:confirmed,on_way,arrived,in_progress,done,cancelled'],
        ]);

        $booking->update(['status' => $validated['status']]);

        // If status is done, create invoice
        if ($validated['status'] === 'done') {
            \App\Models\Invoice::firstOrCreate(
                ['booking_id' => $booking->id],
                ['total' => $booking->total]
            );
        }

        // Send notifications
        $this->notificationService->sendStatusNotification($booking);

        return response()->json([
            'status' => 200,
            'message' => 'Booking status updated successfully.',
            'data' => $booking
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $booking = Booking::findOrFail($id);

        if ($booking->client_id !== $request->user()->id) {
            return response()->json([
                'status' => 403,
                'error' => 'Forbidden',
                'message' => 'You can only cancel your own bookings.'
            ], 403);
        }

        if ($booking->status->value !== 'pending') {
            return response()->json([
                'status' => 422,
                'error' => 'Unprocessable Entity',
                'message' => 'You can only cancel pending bookings.'
            ], 422);
        }

        $booking->update(['status' => 'cancelled']);

        // Send notification
        $this->notificationService->sendStatusNotification($booking);

        return response()->json([
            'status' => 200,
            'message' => 'Booking cancelled successfully.'
        ]);
    }
}
