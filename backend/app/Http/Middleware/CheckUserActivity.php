<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CheckUserActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Update user activity if authenticated
        if (Auth::guard('api')->check()) {
            $user = Auth::guard('api')->user();
            $user->update(['last_activity' => now()]);
        }

        return $next($request);
    }
} 