<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserManagementController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(): JsonResponse
    {
        $users = User::latest()->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    /**
     * Display user details.
     */
    public function show(int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        return response()->json([
            'user' => $user,
        ]);
    }

    /**
     * Activate or deactivate a user.
     */
    public function toggleStatus(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'status' => 'nullable|string|in:active,inactive',
        ]);

        if (isset($validated['status'])) {
            $user->status = $validated['status'];
        } else {
            $user->status = $user->status === 'active' ? 'inactive' : 'active';
        }

        $user->save();

        return response()->json([
            'message' => "User status updated to {$user->status}.",
            'user' => $user,
        ]);
    }
}
