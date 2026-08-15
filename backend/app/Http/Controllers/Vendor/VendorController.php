<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * Foundation status endpoint for Vendor backend verification.
     */
    public function ping(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Vendor API foundation is ready.',
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role,
            ],
        ]);
    }

    /**
     * Display authenticated vendor dashboard statistics.
     */
    public function dashboard(Request $request): JsonResponse
    {
        $vendorId = $request->user()->id;

        $totalProducts = Product::where('vendor_id', $vendorId)->count();
        $activeProducts = Product::where('vendor_id', $vendorId)->where('status', 'active')->count();
        $pendingProducts = Product::where('vendor_id', $vendorId)->where('status', 'pending')->count();
        $vendorOrders = Order::whereHas('items', function ($query) use ($vendorId) {
            $query->where('vendor_id', $vendorId);
        })->count();

        return response()->json([
            'stats' => [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'pending_products' => $pendingProducts,
                'vendor_orders' => $vendorOrders,
            ],
        ]);
    }

    /**
     * View authenticated vendor profile.
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    /**
     * Update authenticated vendor profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user->fresh(),
        ]);
    }
}
