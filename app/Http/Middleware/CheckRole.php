<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    public function handle(Request $request, Closure $next, $role)
    {
        \Log::info('CheckRole Middleware', [
            'user' => $request->user() ? $request->user()->toArray() : null,
            'required_role' => $role,
        ]);
        if (! $request->user() || $request->user()->role !== $role) {
            abort(403, 'You do not have permission to access this page.');
        }
        return $next($request);
    }
}