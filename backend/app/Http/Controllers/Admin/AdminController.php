<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class AdminController extends Controller
{
    /**
     * Foundation status endpoint for Admin backend verification.
     */
    public function ping(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'ok',
            'message' => 'Admin API foundation is ready.',
            'user' => [
                'id' => $request->user()->id,
                'name' => $request->user()->name,
                'email' => $request->user()->email,
                'role' => $request->user()->role,
            ],
        ]);
    }

    /**
     * Admin Dashboard statistics endpoint.
     */
    public function dashboard(): JsonResponse
    {
        $totalCustomers = User::where('role', 'customer')->count();
        $totalVendors = User::where('role', 'vendor')->count();

        $totalProducts = Schema::hasTable('products') ? DB::table('products')->count() : 0;
        
        $pendingVendors = User::where('role', 'vendor')->where('status', 'pending')->count();
        $pendingProducts = Schema::hasTable('products') ? DB::table('products')->where('status', 'pending')->count() : 0;

        $pendingApprovals = $pendingVendors + $pendingProducts;

        return response()->json([
            'stats' => [
                'total_customers' => $totalCustomers,
                'total_vendors' => $totalVendors,
                'total_products' => $totalProducts,
                'pending_approvals' => $pendingApprovals,
            ],
        ]);
    }
}
