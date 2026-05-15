<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Service;
use Illuminate\Support\Facades\DB;

class BookingService
{
    public function createBooking(array $data, $clientId)
    {
        return DB::transaction(function () use ($data, $clientId) {
            $services = Service::findMany($data['service_ids']);
            $total = $services->sum('price');

            $booking = Booking::create([
                'client_id' => $clientId,
                'hairdresser_id' => $data['hairdresser_id'],
                'address' => $data['address'],
                'booking_date' => $data['booking_date'],
                'total' => $total,
                'status' => \App\Enums\BookingStatus::PENDING,
            ]);

            $booking->services()->attach($data['service_ids']);

            return $booking;
        });
    }
}
