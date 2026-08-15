<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VendorProductController extends Controller
{
    /**
     * Display listing of products belonging to the authenticated vendor.
     */
    public function index(Request $request): JsonResponse
    {
        $products = Product::where('vendor_id', $request->user()->id)
            ->with('category:id,name')
            ->latest()
            ->get();

        return response()->json([
            'products' => $products,
        ]);
    }

    /**
     * Display a specific product belonging to the authenticated vendor.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $product = Product::where('vendor_id', $request->user()->id)
            ->with('category:id,name')
            ->findOrFail($id);

        return response()->json([
            'product' => $product,
        ]);
    }

    /**
     * Store a new product submitted by the authenticated vendor.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $product = Product::create([
            'vendor_id' => $request->user()->id,
            'category_id' => $validated['category_id'] ?? null,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'] ?? 0,
            'status' => 'pending', // Requires admin approval
        ]);

        return response()->json([
            'message' => 'Product created and submitted for admin approval.',
            'product' => $product->load('category:id,name'),
        ], 201);
    }

    /**
     * Update a product belonging to the authenticated vendor.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::where('vendor_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'nullable|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $product->update([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'stock' => $validated['stock'] ?? $product->stock,
            'category_id' => $validated['category_id'] ?? null,
            'status' => 'pending', // Re-submitted for approval upon edit
        ]);

        return response()->json([
            'message' => 'Product updated and re-submitted for admin approval.',
            'product' => $product->fresh('category:id,name'),
        ]);
    }

    /**
     * Update product inventory stock level directly.
     */
    public function updateStock(Request $request, int $id): JsonResponse
    {
        $product = Product::where('vendor_id', $request->user()->id)->findOrFail($id);

        $validated = $request->validate([
            'stock' => 'required|integer|min:0',
        ]);

        $product->stock = $validated['stock'];
        $product->save();

        return response()->json([
            'message' => "Inventory updated to {$product->stock} units.",
            'product' => $product->fresh('category:id,name'),
        ]);
    }

    /**
     * Get active categories for product selection.
     */
    public function categories(): JsonResponse
    {
        $categories = Category::where('status', 'active')->select(['id', 'name'])->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }
}
