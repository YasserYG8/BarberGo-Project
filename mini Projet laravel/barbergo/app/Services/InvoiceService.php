<?php

namespace App\Services;

use App\Models\Booking;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceService
{
    public function generatePdf(Booking $booking)
    {
        $booking->load(['client', 'hairdresser.user', 'services']);
        
        $pdf = Pdf::loadView('pdf.invoice', compact('booking'));
        
        return $pdf;
    }
}
