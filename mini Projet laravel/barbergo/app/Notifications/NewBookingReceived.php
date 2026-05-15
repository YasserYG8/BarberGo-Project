<?php

namespace App\Notifications;

use App\Models\Booking;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewBookingReceived extends Notification
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
        $this->booking->load(['client', 'services']);

        $serviceNames = $this->booking->services->pluck('name')->implode(', ');

        return (new MailMessage)
                    ->subject('New Booking Request - BarberGo')
                    ->greeting('Hello ' . $notifiable->name . '!')
                    ->line('You have received a new booking request.')
                    ->line('**Client:** ' . $this->booking->client->name)
                    ->line('**Date:** ' . $this->booking->booking_date->format('d/m/Y H:i'))
                    ->line('**Address:** ' . $this->booking->address)
                    ->line('**Services:** ' . $serviceNames)
                    ->line('**Total:** ' . $this->booking->total . ' TND')
                    ->action('View Your Dashboard', url('/'))
                    ->line('Please confirm or manage this booking from your dashboard.');
    }
}
