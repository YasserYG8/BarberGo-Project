<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Services\InvoiceService;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    protected $invoiceService;

    public function __construct(InvoiceService $invoiceService)
    {
        $this->invoiceService = $invoiceService;
    }

    public function downloadPdf($bookingId, Request $request)
    {
        $booking = Booking::findOrFail($bookingId);

        // Check authorization: client, admin, or the specific hairdresser
        $isClient = $booking->client_id === $request->user()->id;
        $isAdmin = $request->user()->role->value === 'admin';
        $isHairdresser = $request->user()->role->value === 'hairdresser' && 
                         $request->user()->hairdresser !== null && 
                         $booking->hairdresser_id === $request->user()->hairdresser->id;

        if (!$isClient && !$isAdmin && !$isHairdresser) {
            return response()->json([
                'status' => 403,
                'error' => 'Forbidden',
                'message' => 'You are not authorized to view this invoice.'
            ], 403);
        }

        $pdf = $this->invoiceService->generatePdf($booking);

        return $pdf->download('invoice-'.$booking->id.'.pdf');
    }
}
