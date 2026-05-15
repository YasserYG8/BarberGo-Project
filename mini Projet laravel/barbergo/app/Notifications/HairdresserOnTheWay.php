<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class HairdresserOnTheWay extends Notification
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
                    ->subject('Hairdresser On The Way - BarberGo')
                    ->line('Your hairdresser ' . $this->booking->hairdresser->user->name . ' is on the way to your address.')
                    ->line('Address: ' . $this->booking->address)
                    ->action('Track Booking', url('/bookings/' . $this->booking->id))
                    ->line('Please be ready!');
    }
}
