<?php

namespace App\Notifications;

use App\Models\Booking;
use App\Services\InvoiceService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingDone extends Notification
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
        $this->booking->load(['client', 'hairdresser.user', 'services']);

        // Generate the invoice PDF
        $invoiceService = app(InvoiceService::class);
        $pdf = $invoiceService->generatePdf($this->booking);

        $filename = 'BarberGo_Invoice_' . $this->booking->id . '.pdf';

        return (new MailMessage)
                    ->subject('Booking Completed - BarberGo Invoice #' . $this->booking->id)
                    ->greeting('Hello ' . $notifiable->name . '!')
                    ->line('Your booking has been successfully completed.')
                    ->line('**Hairdresser:** ' . $this->booking->hairdresser->user->name)
                    ->line('**Date:** ' . $this->booking->booking_date->format('d/m/Y H:i'))
                    ->line('**Total:** ' . $this->booking->total . ' TND')
                    ->line('Please find your invoice attached to this email.')
                    ->line('We hope you enjoyed the service!')
                    ->action('Rate your experience', url('/'))
                    ->line('Thank you for using BarberGo!')
                    ->attachData($pdf->output(), $filename, [
                        'mime' => 'application/pdf',
                    ]);
    }
}
