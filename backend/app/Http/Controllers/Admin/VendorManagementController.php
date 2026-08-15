<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorManagementController extends Controller
{
    /**
     * Display a listing of vendors.
     */
    public function index(): JsonResponse
    {
        $vendors = User::where('role', 'vendor')->get();

        return response()->json([
            'vendors' => $vendors,
        ]);
    }

    /**
     * Display vendor details.
     */
    public function show(int $id): JsonResponse
    {
        $vendor = User::where('role', 'vendor')->where('id', $id)->firstOrFail();

        return response()->json([
            'vendor' => $vendor,
        ]);
    }

    /**
     * Approve vendor.
     */
    public function approve(int $id): JsonResponse
    {
        $vendor = User::where('role', 'vendor')->where('id', $id)->firstOrFail();
        $vendor->status = 'active';
        $vendor->save();

        return response()->json([
            'message' => 'Vendor approved successfully.',
            'vendor' => $vendor,
        ]);
    }

    /**
     * Reject vendor.
     */
    public function reject(int $id): JsonResponse
    {
        $vendor = User::where('role', 'vendor')->where('id', $id)->firstOrFail();
        $vendor->status = 'rejected';
        $vendor->save();

        return response()->json([
            'message' => 'Vendor rejected.',
            'vendor' => $vendor,
        ]);
    }

    /**
     * Activate/deactivate vendor.
     */
    public function toggleStatus(Request $request, int $id): JsonResponse
    {
        $vendor = User::where('role', 'vendor')->where('id', $id)->firstOrFail();

        $validated = $request->validate([
            'status' => 'required|string|in:active,inactive',
        ]);

        $vendor->status = $validated['status'];
        $vendor->save();

        return response()->json([
            'message' => "Vendor status updated to {$vendor->status}.",
            'vendor' => $vendor,
        ]);
    }
}
