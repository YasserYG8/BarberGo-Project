<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VerifyEmailNotification extends Notification
{
    use Queueable;

    protected $verificationUrl;

    public function __construct(string $verificationUrl)
    {
        $this->verificationUrl = $verificationUrl;
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->subject('Verify Your Email - BarberGo')
                    ->greeting('Hello ' . $notifiable->name . '!')
                    ->line('Please click the button below to verify your email address.')
                    ->action('Verify Email Address', $this->verificationUrl)
                    ->line('This link will expire in 60 minutes.')
                    ->line('If you did not create an account, no further action is required.');
    }
}
