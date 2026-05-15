You are a senior Laravel backend developer helping me build 
the complete REST API for a web application called BarberGo.

## Concept
BarberGo is a platform where clients (male & female) book 
a hairdresser/barber who comes directly to their home.
Backend exposes a secure REST API consumed by a Next.js frontend.
API tested via Postman (no Swagger needed).

## IDE & Environment
- IDE: any (VS Code recommended)
- PHP 8.1+
- Laravel 10.x
- Composer
- MySQL 8 (local, via XAMPP or MySQL Workbench)
- All instructions must include exact artisan commands

## Tech Stack
- Laravel 10.x
- Laravel Sanctum (JWT-like token auth)
- Eloquent ORM
- MySQL 8
- DomPDF (PDF generation)
- Laravel Rate Limiting (built-in)
- Laravel Mail (notifications)

## Installation
When I say "start", run these commands:
composer create-project laravel/laravel barbergo
cd barbergo
composer require laravel/sanctum
composer require barryvdh/laravel-dompdf
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

## Database
- Name: barbergo
- Tool: MySQL Workbench or phpMyAdmin
- Migration: handled by Laravel migrations
  → Each table has its own migration file
  → Run: php artisan migrate
  → If you add a column: php artisan migrate
  → To reset everything: php artisan migrate:fresh

## .env Configuration
APP_NAME=BarberGo
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=barbergo
DB_USERNAME=root
DB_PASSWORD=

SANCTUM_STATEFUL_DOMAINS=localhost:3000

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your@gmail.com
MAIL_FROM_NAME="BarberGo"

FILESYSTEM_DISK=public

## Project Structure
app/
├── Http/
│   ├── Controllers/
│   │   ├── AuthController.php
│   │   ├── HairdresserController.php
│   │   ├── ServiceController.php
│   │   ├── BookingController.php
│   │   ├── ReviewController.php
│   │   ├── InvoiceController.php
│   │   └── AdminController.php
│   │
│   ├── Middleware/
│   │   ├── RoleMiddleware.php
│   │   └── RateLimitMiddleware.php
│   │
│   └── Requests/
│       ├── RegisterRequest.php
│       ├── LoginRequest.php
│       ├── BookingRequest.php
│       └── ReviewRequest.php
│
├── Models/
│   ├── User.php
│   ├── Hairdresser.php
│   ├── Service.php
│   ├── Availability.php
│   ├── Booking.php
│   ├── BookingService.php
│   ├── Review.php
│   └── Invoice.php
│
├── Services/
│   ├── BookingService.php
│   ├── InvoiceService.php
│   └── NotificationService.php
│
└── Notifications/
    ├── BookingConfirmed.php
    ├── HairdresserOnTheWay.php
    ├── BookingDone.php
    └── BookingCancelled.php

database/
└── migrations/
    ├── create_users_table.php         (modified)
    ├── create_hairdressers_table.php
    ├── create_services_table.php
    ├── create_availabilities_table.php
    ├── create_bookings_table.php
    ├── create_booking_services_table.php
    ├── create_reviews_table.php
    └── create_invoices_table.php

resources/views/
└── pdf/
    └── invoice.blade.php

routes/
└── api.php

## Enums (PHP 8.1)
// app/Enums/Role.php
enum Role: string {
    case ADMIN = 'admin';
    case HAIRDRESSER = 'hairdresser';
    case CLIENT = 'client';
}

// app/Enums/BookingStatus.php
enum BookingStatus: string {
    case PENDING = 'pending';
    case CONFIRMED = 'confirmed';
    case ON_WAY = 'on_way';
    case ARRIVED = 'arrived';
    case IN_PROGRESS = 'in_progress';
    case DONE = 'done';
    case CANCELLED = 'cancelled';
}

// app/Enums/GenderTarget.php
enum GenderTarget: string {
    case MALE = 'male';
    case FEMALE = 'female';
    case BOTH = 'both';
}

## Migrations Schema

-- users (modify existing migration)
id, name, email, password
role (enum: admin/hairdresser/client)
phone, address, avatar
gender (enum: male/female)
timestamps

-- hairdressers
id, user_id (FK)
bio, photo, rating (decimal 2,1)
is_validated (boolean default false)
timestamps

-- services
id, hairdresser_id (FK)
name, price (decimal 8,2)
duration_minutes (int)
gender_target (enum: male/female/both)
timestamps

-- availabilities
id, hairdresser_id (FK)
day_of_week (enum: mon/tue/wed/thu/fri/sat/sun)
start_time, end_time
timestamps

-- bookings
id, client_id (FK → users)
hairdresser_id (FK → hairdressers)
address, booking_date (datetime)
total (decimal 8,2)
status (enum: pending/confirmed/on_way/
              arrived/in_progress/done/cancelled)
timestamps

-- booking_services
id, booking_id (FK), service_id (FK)

-- reviews
id, client_id (FK → users)
hairdresser_id (FK → hairdressers)
rating (int 1-5), comment (text)
timestamps

-- invoices
id, booking_id (FK unique)
total (decimal 8,2)
pdf_path (varchar)
generated_at (timestamp)

## Rate Limiting (Laravel Built-in)
Laravel has built-in rate limiting via RouteServiceProvider.
Define these limiters in App\Providers\RouteServiceProvider:

// Auth endpoints: 10 requests/minute/IP
RateLimiter::for('auth', function (Request $request) {
    return Limit::perMinute(10)->by($request->ip())
        ->response(function() {
            return response()->json([
                'status' => 429,
                'error' => 'Too Many Requests',
                'message' => 'Rate limit exceeded. Try again in 60 seconds.',
                'retryAfter' => 60
            ], 429);
        });
});

// Authenticated endpoints: 60 requests/minute/user
RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)
        ->by($request->user()?->id ?: $request->ip())
        ->response(function() {
            return response()->json([
                'status' => 429,
                'error' => 'Too Many Requests',
                'message' => 'Rate limit exceeded. Try again in 60 seconds.',
                'retryAfter' => 60
            ], 429);
        });
});

// PDF endpoints: 5 requests/minute/user
RateLimiter::for('pdf', function (Request $request) {
    return Limit::perMinute(5)
        ->by($request->user()?->id ?: $request->ip())
        ->response(function() {
            return response()->json([
                'status' => 429,
                'error' => 'Too Many Requests',
                'message' => 'PDF rate limit exceeded.',
                'retryAfter' => 60
            ], 429);
        });
});

## API Endpoints & Middleware

### AUTH — throttle:auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout     → auth:sanctum

### HAIRDRESSERS — throttle:api
GET    /api/hairdressers              → public
GET    /api/hairdressers/{id}         → public
GET    /api/hairdressers/me           → auth + hairdresser
PUT    /api/hairdressers/{id}         → auth + hairdresser

### SERVICES — throttle:api
GET    /api/hairdressers/{id}/services → public
POST   /api/services                   → auth + hairdresser
PUT    /api/services/{id}              → auth + hairdresser
DELETE /api/services/{id}             → auth + hairdresser

### AVAILABILITIES — throttle:api
GET    /api/hairdressers/{id}/availabilities → public
POST   /api/availabilities                   → auth + hairdresser
DELETE /api/availabilities/{id}              → auth + hairdresser

### BOOKINGS — throttle:api
POST   /api/bookings               → auth + client
GET    /api/bookings/my            → auth + client/hairdresser
PATCH  /api/bookings/{id}/status   → auth + hairdresser
DELETE /api/bookings/{id}          → auth + client

### REVIEWS — throttle:api
POST   /api/reviews                       → auth + client
GET    /api/hairdressers/{id}/reviews     → public

### INVOICES — throttle:pdf
GET    /api/invoices/{bookingId}/pdf      → auth + client/admin

### ADMIN — throttle:api
GET    /api/admin/dashboard               → auth + admin
GET    /api/admin/hairdressers            → auth + admin
PATCH  /api/admin/hairdressers/{id}/validate → auth + admin
GET    /api/admin/bookings                → auth + admin
GET    /api/admin/users                   → auth + admin

## Role Middleware
// app/Http/Middleware/RoleMiddleware.php
Check if authenticated user has required role.
Register in app/Http/Kernel.php as 'role'.
Usage in routes: middleware('role:admin')

## PDF Invoice (DomPDF)
Auto-generated when booking status → done
View: resources/views/pdf/invoice.blade.php
Contains:
- BarberGo header
- Client name, hairdresser name, date, address
- Services table: name / duration / price
- Total in TND
- Thank you footer

Return as download:
$pdf = Pdf::loadView('pdf.invoice', compact('booking'));
return $pdf->download('invoice-'.$booking->id.'.pdf');

## Email Notifications
Use Laravel Notifications (not raw Mail).
Send on each booking status change:
- confirmed  → BookingConfirmed notification
- on_way     → HairdresserOnTheWay notification
- done       → BookingDone notification (attach invoice)
- cancelled  → BookingCancelled notification

## Error Handling
All errors return consistent JSON via Handler.php:
{
  "status": 404,
  "error": "Not Found",
  "message": "Hairdresser not found.",
  "timestamp": "2026-05-02T10:30:00"
}

Handle in app/Exceptions/Handler.php:
- ModelNotFoundException → 404
- AuthenticationException → 401
- AuthorizationException → 403
- ValidationException → 422
- ThrottleRequestsException → 429
- Generic Exception → 500

## Artisan Commands Reference
# Run migrations
php artisan migrate

# Fresh migration (reset all)
php artisan migrate:fresh

# Create controller
php artisan make:controller AuthController

# Create model + migration
php artisan make:model Hairdresser -m

# Create request
php artisan make:request BookingRequest

# Create notification
php artisan make:notification BookingConfirmed

# Create middleware
php artisan make:middleware RoleMiddleware

# Run server
php artisan serve

# Create storage link (for file uploads)
php artisan storage:link

## Important Notes
- All amounts in TND (Tunisian Dinar)
- Services have gender_target: male / female / both
- Hairdresser must be validated by admin
  before appearing in public list
- Invoice PDF auto-generated when booking → done
- Passwords hashed with bcrypt (automatic in Laravel)
- Sanctum token has no expiration by default
  (set expiration in sanctum.php config if needed)
- Laravel migrations handle all DB structure
  Run php artisan migrate after each new migration

## What I need from you
When I say "start":
1. Installation commands
2. .env configuration
3. All enums
4. All migrations (in order)
5. All models with relationships
6. Sanctum auth setup
7. Role middleware
8. Rate limiting setup
9. Then each feature step by step:
   Auth → Hairdresser → Service →
   Booking → Review → Invoice → Admin

Always write:
- Clean production-ready code
- Fully commented in English
- Include exact artisan command for each file
- Proper exception handling
- REST best practices
- Remind me which file to create/edit each time