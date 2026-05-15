<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || $request->user()->role->value !== $role) {
            return response()->json([
                'status' => 403,
                'error' => 'Forbidden',
                'message' => 'You do not have the required role to access this resource.'
            ], 403);
        }

        return $next($request);
    }
}
