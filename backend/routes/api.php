<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::middleware('role:customer')->get('/customer/dashboard', function (Request $request) {
        return response()->json(['message' => 'Customer area']);
    });

    Route::middleware('role:vendor')->get('/vendor/dashboard', function (Request $request) {
        return response()->json(['message' => 'Vendor area']);
    });

    Route::middleware('role:admin')->get('/admin/dashboard', function (Request $request) {
        return response()->json(['message' => 'Admin area']);
    });
});

Route::get('/status', function () {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $dbStatus = 'connected';
        $dbName = \Illuminate\Support\Facades\DB::connection()->getDatabaseName();
    } catch (\Exception $e) {
        $dbStatus = 'disconnected: ' . $e->getMessage();
        $dbName = null;
    }

    return response()->json([
        'status' => 'ok',
        'app' => config('app.name'),
        'environment' => config('app.env'),
        'database' => [
            'status' => $dbStatus,
            'name' => $dbName,
            'driver' => config('database.default'),
        ],
        'timestamp' => now()->toIso8601String(),
    ]);
});
