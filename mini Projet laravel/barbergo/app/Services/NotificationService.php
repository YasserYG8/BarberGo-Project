<?php

namespace App\Services;

use App\Models\Booking;
use App\Notifications\BookingConfirmed;
use App\Notifications\HairdresserOnTheWay;
use App\Notifications\BookingDone;
use App\Notifications\BookingCancelled;
use App\Notifications\NewBookingReceived;

class NotificationService
{
    /**
     * Notify the hairdresser when a new booking is created.
     */
    public function sendNewBookingNotification(Booking $booking)
    {
        $booking->load('hairdresser.user');

        $hairdresserUser = $booking->hairdresser->user;

        if ($hairdresserUser) {
            $hairdresserUser->notify(new NewBookingReceived($booking));
        }
    }

    /**
     * Notify the client when a booking status changes.
     */
    public function sendStatusNotification(Booking $booking)
    {
        $client = $booking->client;
        
        switch ($booking->status->value) {
            case 'confirmed':
                $client->notify(new BookingConfirmed($booking));
                break;
            case 'on_way':
                $client->notify(new HairdresserOnTheWay($booking));
                break;
            case 'done':
                $client->notify(new BookingDone($booking));
                break;
            case 'cancelled':
                $client->notify(new BookingCancelled($booking));
                // Also notify the hairdresser
                $booking->load('hairdresser.user');
                if ($booking->hairdresser && $booking->hairdresser->user) {
                    $booking->hairdresser->user->notify(new BookingCancelled($booking));
                }
                break;
        }
    }
}
