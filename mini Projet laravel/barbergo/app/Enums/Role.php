<?php

namespace App\Enums;

enum Role: string {
    case ADMIN = 'admin';
    case HAIRDRESSER = 'hairdresser';
    case CLIENT = 'client';
}
