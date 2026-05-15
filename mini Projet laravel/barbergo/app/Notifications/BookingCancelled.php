<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingCancelled extends Notification
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
        $this->booking->load(['client', 'hairdresser.user']);

        return (new MailMessage)
                    ->subject('Booking Cancelled - BarberGo')
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('A booking has been cancelled.')
                    ->line('**Client:** ' . $this->booking->client->name)
                    ->line('**Hairdresser:** ' . $this->booking->hairdresser->user->name)
                    ->line('**Date:** ' . $this->booking->booking_date->format('d/m/Y H:i'))
                    ->line('**Address:** ' . $this->booking->address)
                    ->line('**Total:** ' . $this->booking->total . ' TND')
                    ->line('If you have any questions, please contact us.');
    }
}
