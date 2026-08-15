<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CategoryRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryManagementController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(): JsonResponse
    {
        $categories = Category::latest()->get();

        return response()->json([
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created category.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $slug = Str::slug($validated['name']);
        
        // Ensure unique slug
        $originalSlug = $slug;
        $count = 1;
        while (Category::where('slug', $slug)->exists()) {
            $slug = "{$originalSlug}-{$count}";
            $count++;
        }

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'] ?? 'active',
        ]);

        return response()->json([
            'message' => 'Category created successfully.',
            'category' => $category,
        ], 201);
    }

    /**
     * Update an existing category.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        if ($validated['name'] !== $category->name) {
            $slug = Str::slug($validated['name']);
            $originalSlug = $slug;
            $count = 1;
            while (Category::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                $slug = "{$originalSlug}-{$count}";
                $count++;
            }
            $category->slug = $slug;
        }

        $category->name = $validated['name'];
        $category->description = $validated['description'] ?? null;
        if (isset($validated['status'])) {
            $category->status = $validated['status'];
        }
        $category->save();

        return response()->json([
            'message' => 'Category updated successfully.',
            'category' => $category,
        ]);
    }

    /**
     * Activate/deactivate category.
     */
    public function toggleStatus(int $id): JsonResponse
    {
        $category = Category::findOrFail($id);
        $category->status = $category->status === 'active' ? 'inactive' : 'active';
        $category->save();

        return response()->json([
            'message' => "Category status updated to {$category->status}.",
            'category' => $category,
        ]);
    }

    /**
     * List vendor category requests.
     */
    public function requests(): JsonResponse
    {
        $requests = CategoryRequest::with('vendor:id,name,email')->latest()->get();

        return response()->json([
            'requests' => $requests,
        ]);
    }

    /**
     * Approve vendor category request.
     */
    public function approveRequest(int $id): JsonResponse
    {
        $categoryRequest = CategoryRequest::findOrFail($id);
        $categoryRequest->status = 'approved';
        $categoryRequest->save();

        // Create category if it doesn't already exist
        $slug = Str::slug($categoryRequest->name);
        $category = Category::firstOrCreate(
            ['slug' => $slug],
            [
                'name' => $categoryRequest->name,
                'description' => $categoryRequest->reason,
                'status' => 'active',
            ]
        );

        return response()->json([
            'message' => 'Category request approved.',
            'request' => $categoryRequest,
            'category' => $category,
        ]);
    }

    /**
     * Reject vendor category request.
     */
    public function rejectRequest(int $id): JsonResponse
    {
        $categoryRequest = CategoryRequest::findOrFail($id);
        $categoryRequest->status = 'rejected';
        $categoryRequest->save();

        return response()->json([
            'message' => 'Category request rejected.',
            'request' => $categoryRequest,
        ]);
    }
}
