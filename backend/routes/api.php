<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\VendorManagementController;
use App\Http\Controllers\Admin\CategoryManagementController;
use App\Http\Controllers\Admin\ProductManagementController;
use App\Http\Controllers\Admin\UserManagementController;

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

    // Admin API Routes Group
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/ping', [AdminController::class, 'ping']);
        Route::get('/dashboard', [AdminController::class, 'dashboard']);

        // Vendor Management Routes
        Route::get('/vendors', [VendorManagementController::class, 'index']);
        Route::get('/vendors/{id}', [VendorManagementController::class, 'show']);
        Route::post('/vendors/{id}/approve', [VendorManagementController::class, 'approve']);
        Route::post('/vendors/{id}/reject', [VendorManagementController::class, 'reject']);
        Route::post('/vendors/{id}/status', [VendorManagementController::class, 'toggleStatus']);

        // Category Management Routes
        Route::get('/categories', [CategoryManagementController::class, 'index']);
        Route::post('/categories', [CategoryManagementController::class, 'store']);
        Route::put('/categories/{id}', [CategoryManagementController::class, 'update']);
        Route::post('/categories/{id}/status', [CategoryManagementController::class, 'toggleStatus']);

        // Vendor Category Requests Routes
        Route::get('/category-requests', [CategoryManagementController::class, 'requests']);
        Route::post('/category-requests/{id}/approve', [CategoryManagementController::class, 'approveRequest']);
        Route::post('/category-requests/{id}/reject', [CategoryManagementController::class, 'rejectRequest']);

        // Product Management Routes
        Route::get('/products', [ProductManagementController::class, 'index']);
        Route::get('/products/{id}', [ProductManagementController::class, 'show']);
        Route::post('/products/{id}/approve', [ProductManagementController::class, 'approve']);
        Route::post('/products/{id}/reject', [ProductManagementController::class, 'reject']);
        Route::post('/products/{id}/status', [ProductManagementController::class, 'toggleStatus']);

        // User Management Routes
        Route::get('/users', [UserManagementController::class, 'index']);
        Route::get('/users/{id}', [UserManagementController::class, 'show']);
        Route::post('/users/{id}/status', [UserManagementController::class, 'toggleStatus']);
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
