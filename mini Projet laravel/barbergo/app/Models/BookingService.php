<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class BookingService extends Pivot
{
    use HasFactory;

    protected $table = 'booking_services';

    protected $fillable = [
        'booking_id',
        'service_id',
    ];
}
