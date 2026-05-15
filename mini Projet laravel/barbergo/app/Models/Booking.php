<?php

namespace App\Models;

use App\Enums\BookingStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'hairdresser_id',
        'address',
        'booking_date',
        'total',
        'status',
    ];

    protected $casts = [
        'booking_date' => 'datetime',
        'status' => BookingStatus::class,
        'total' => 'decimal:2',
    ];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function hairdresser()
    {
        return $this->belongsTo(Hairdresser::class);
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'booking_services');
    }

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }
}
