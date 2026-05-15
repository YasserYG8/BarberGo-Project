<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountRejected extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Update on your BarberGo Professional Application')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Thank you for your interest in joining BarberGo as a professional hairdresser.')
            ->line('After careful review, we regret to inform you that your application has not been approved at this time.')
            ->line('Your account role has been reverted to a Client. You can still use BarberGo to book appointments with other professionals.')
            ->action('Go to BarberGo', url('http://localhost:3000'))
            ->line('Thank you for your understanding.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
