<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\VendorManagementController;
use App\Http\Controllers\Admin\CategoryManagementController;
use App\Http\Controllers\Admin\ProductManagementController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Vendor\VendorController;
use App\Http\Controllers\Vendor\VendorProductController;
use App\Http\Controllers\Vendor\VendorOrderController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::middleware('role:customer')->get('/customer/dashboard', function (Request $request) {
        return response()->json(['message' => 'Customer area']);
    });

    // Vendor API Routes Group
    Route::prefix('vendor')->middleware('role:vendor')->group(function () {
        Route::get('/ping', [VendorController::class, 'ping']);
        Route::get('/dashboard', [VendorController::class, 'dashboard']);
        Route::get('/profile', [VendorController::class, 'profile']);
        Route::put('/profile', [VendorController::class, 'updateProfile']);

        // Vendor Product Routes
        Route::get('/products', [VendorProductController::class, 'index']);
        Route::post('/products', [VendorProductController::class, 'store']);
        Route::get('/products/{id}', [VendorProductController::class, 'show']);
        Route::put('/products/{id}', [VendorProductController::class, 'update']);
        Route::post('/products/{id}/stock', [VendorProductController::class, 'updateStock']);
        Route::get('/categories', [VendorProductController::class, 'categories']);

        // Vendor Order Routes
        Route::get('/orders', [VendorOrderController::class, 'index']);
        Route::get('/orders/{id}', [VendorOrderController::class, 'show']);
        Route::post('/orders/{id}/status', [VendorOrderController::class, 'updateStatus']);
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
