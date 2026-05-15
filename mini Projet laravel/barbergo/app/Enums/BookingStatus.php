<?php

namespace App\Enums;

enum BookingStatus: string {
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case ON_WAY = 'on_way';
    case ARRIVED = 'arrived';
    case IN_PROGRESS = 'in_progress';
    case DONE = 'done';
    case CANCELLED = 'cancelled';
}
