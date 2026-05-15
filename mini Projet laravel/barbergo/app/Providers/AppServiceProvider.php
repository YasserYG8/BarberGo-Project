<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
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
    }
}
