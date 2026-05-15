<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\HairdresserController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\AdminController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| BarberGo API Routes
|--------------------------------------------------------------------------
| Auth:         10 req/min/IP
| API:          60 req/min/user
| PDF:          5 req/min/user
*/

// ── Auth routes ─────────────────────────────────────────────────────────
Route::prefix('auth')->middleware('throttle:auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

// Profile routes (auth required, no throttle restriction on reads)
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/me', [AuthController::class, 'updateMe']);
    Route::post('/auth/profile-picture', [AuthController::class, 'uploadProfilePicture']);
    Route::post('/auth/send-verification-email', [AuthController::class, 'sendVerificationEmail']);
});

// Email verification callback (signed URL, no auth required)
Route::get('/auth/verify-email/{id}/{hash}', [AuthController::class, 'verifyEmail'])
    ->name('verification.verify');

// ── Hairdresser routes ──────────────────────────────────────────────────
// IMPORTANT: Specific named routes MUST come before the wildcard /{id}
// Otherwise "/me" would be matched as hairdresser with id="me".
Route::prefix('hairdressers')->middleware('throttle:api')->group(function () {
    // Public endpoints
    Route::get('/', [HairdresserController::class, 'index']);

    // Protected: hairdresser-only – placed BEFORE /{id} wildcard to avoid conflict
    Route::middleware(['auth:sanctum', 'role:hairdresser'])->group(function () {
        Route::get('/me', [HairdresserController::class, 'me']);
        Route::put('/update', [HairdresserController::class, 'updateMe']);
    });

    // Public endpoints with {id} wildcard
    Route::get('/{id}', [HairdresserController::class, 'show'])->whereNumber('id');
    Route::get('/{id}/services', [ServiceController::class, 'index'])->whereNumber('id');
    Route::get('/{id}/availabilities', [AvailabilityController::class, 'index'])->whereNumber('id');
    Route::get('/{id}/reviews', [ReviewController::class, 'index'])->whereNumber('id');

    // Protected: update specific hairdresser (uses id)
    Route::middleware(['auth:sanctum', 'role:hairdresser'])->group(function () {
        Route::put('/{id}', [HairdresserController::class, 'update'])->whereNumber('id');
    });
});

// ── Service routes ─────────────────────────────────────────────────────
Route::prefix('services')
    ->middleware(['auth:sanctum', 'role:hairdresser', 'throttle:api'])
    ->group(function () {
        Route::post('/', [ServiceController::class, 'store']);
        Route::put('/{id}', [ServiceController::class, 'update']);
        Route::delete('/{id}', [ServiceController::class, 'destroy']);
    });

// ── Availability routes ────────────────────────────────────────────────
Route::prefix('availabilities')
    ->middleware(['auth:sanctum', 'role:hairdresser', 'throttle:api'])
    ->group(function () {
        Route::post('/', [AvailabilityController::class, 'store']);
        Route::delete('/{id}', [AvailabilityController::class, 'destroy']);
    });

// ── Booking routes ─────────────────────────────────────────────────────
Route::prefix('bookings')->middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::post('/', [BookingController::class, 'store'])->middleware('role:client');
    Route::get('/my', [BookingController::class, 'myBookings']);
    Route::patch('/{id}/status', [BookingController::class, 'updateStatus'])->middleware('role:hairdresser');
    Route::delete('/{id}', [BookingController::class, 'destroy'])->middleware('role:client');
});

// ── Review routes ──────────────────────────────────────────────────────
Route::prefix('reviews')
    ->middleware(['auth:sanctum', 'role:client', 'throttle:api'])
    ->group(function () {
        Route::post('/', [ReviewController::class, 'store']);
    });

// ── Invoice routes ─────────────────────────────────────────────────────
Route::get('/invoices/{bookingId}/pdf', [InvoiceController::class, 'downloadPdf'])
    ->middleware(['auth:sanctum', 'throttle:pdf'])
    ->whereNumber('bookingId');

// ── Admin routes ───────────────────────────────────────────────────────
Route::prefix('admin')
    ->middleware(['auth:sanctum', 'role:admin', 'throttle:api'])
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/hairdressers', [AdminController::class, 'hairdressers']);
        Route::patch('/hairdressers/{id}/validate', [AdminController::class, 'validateHairdresser']);
        Route::patch('/hairdressers/{id}/reject', [AdminController::class, 'rejectHairdresser']);
        Route::get('/bookings', [AdminController::class, 'bookings']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::patch('/users/{id}/role', [AdminController::class, 'updateRole']);
    });
