<?php

namespace App\Models;

use App\Enums\GenderTarget;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    protected $fillable = [
        'hairdresser_id',
        'name',
        'price',
        'duration_minutes',
        'gender_target',
    ];

    protected $casts = [
        'gender_target' => GenderTarget::class,
        'price' => 'decimal:2',
    ];

    public function hairdresser()
    {
        return $this->belongsTo(Hairdresser::class);
    }

    public function bookings()
    {
        return $this->belongsToMany(Booking::class, 'booking_services');
    }
}
