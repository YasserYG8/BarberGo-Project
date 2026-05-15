<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingConfirmed extends Notification
{
    use Queueable;

    protected $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Booking Confirmed - BarberGo')
                    ->line('Your booking for ' . $this->booking->booking_date->format('d/m/Y H:i') . ' has been confirmed.')
                    ->line('Hairdresser: ' . $this->booking->hairdresser->user->name)
                    ->line('Address: ' . $this->booking->address)
                    ->line('Total: ' . $this->booking->total . ' TND')
                    ->action('View Bookings', url('/bookings'))
                    ->line('Thank you for using BarberGo!');
    }
}
