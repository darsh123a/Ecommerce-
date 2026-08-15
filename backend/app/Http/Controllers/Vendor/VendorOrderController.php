<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorOrderController extends Controller
{
    /**
     * Display listing of orders containing items belonging to the authenticated vendor.
     */
    public function index(Request $request): JsonResponse
    {
        $vendorId = $request->user()->id;

        $orders = Order::whereHas('items', function ($query) use ($vendorId) {
            $query->where('vendor_id', $vendorId);
        })->with([
            'customer:id,name,email',
            'items' => function ($query) use ($vendorId) {
                $query->where('vendor_id', $vendorId)->with('product:id,title');
            },
        ])->latest()->get();

        return response()->json([
            'orders' => $orders,
        ]);
    }

    /**
     * Display details of an order containing items belonging to the authenticated vendor.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $vendorId = $request->user()->id;

        $order = Order::whereHas('items', function ($query) use ($vendorId) {
            $query->where('vendor_id', $vendorId);
        })->with([
            'customer:id,name,email',
            'items' => function ($query) use ($vendorId) {
                $query->where('vendor_id', $vendorId)->with('product:id,title');
            },
        ])->findOrFail($id);

        return response()->json([
            'order' => $order,
        ]);
    }

    /**
     * Update status for an order containing items belonging to the authenticated vendor.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $vendorId = $request->user()->id;

        $order = Order::whereHas('items', function ($query) use ($vendorId) {
            $query->where('vendor_id', $vendorId);
        })->findOrFail($id);

        // V1: vendors may set fulfillment statuses only (not cancelled).
        $validated = $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered',
        ]);

        $order->status = $validated['status'];
        $order->save();

        return response()->json([
            'message' => "Order status updated to {$order->status}.",
            'order' => $order->fresh([
                'customer:id,name,email',
                'items' => function ($query) use ($vendorId) {
                    $query->where('vendor_id', $vendorId)->with('product:id,title');
                },
            ]),
        ]);
    }
}
