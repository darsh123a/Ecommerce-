<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductManagementController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(): JsonResponse
    {
        $products = Product::with(['vendor:id,name,email', 'category:id,name'])->latest()->get();

        return response()->json([
            'products' => $products,
        ]);
    }

    /**
     * Display product details.
     */
    public function show(int $id): JsonResponse
    {
        $product = Product::with(['vendor:id,name,email', 'category:id,name'])->findOrFail($id);

        return response()->json([
            'product' => $product,
        ]);
    }

    /**
     * Approve product.
     */
    public function approve(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->status = 'active';
        $product->save();

        return response()->json([
            'message' => 'Product approved successfully.',
            'product' => $product->load(['vendor:id,name,email', 'category:id,name']),
        ]);
    }

    /**
     * Reject product.
     */
    public function reject(int $id): JsonResponse
    {
        $product = Product::findOrFail($id);
        $product->status = 'rejected';
        $product->save();

        return response()->json([
            'message' => 'Product rejected.',
            'product' => $product->load(['vendor:id,name,email', 'category:id,name']),
        ]);
    }

    /**
     * Activate / Deactivate product.
     */
    public function toggleStatus(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'status' => 'nullable|string|in:active,inactive',
        ]);

        if (isset($validated['status'])) {
            $product->status = $validated['status'];
        } else {
            $product->status = $product->status === 'active' ? 'inactive' : 'active';
        }

        $product->save();

        return response()->json([
            'message' => "Product status updated to {$product->status}.",
            'product' => $product->load(['vendor:id,name,email', 'category:id,name']),
        ]);
    }
}
