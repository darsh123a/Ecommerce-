<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if (! $user->isActive()) {
            return response()->json([
                'message' => 'Your account is inactive or suspended.',
            ], 403);
        }

        if (! empty($roles) && ! $user->hasRole($roles)) {
            return response()->json([
                'message' => 'Unauthorized for this role.',
            ], 403);
        }

        return $next($request);
    }
}
