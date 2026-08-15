<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\CategoryRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryManagementApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_category_management(): void
    {
        $response = $this->getJson('/api/admin/categories');
        $response->assertStatus(401);
    }

    public function test_customer_cannot_access_category_management(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $this->actingAs($customer);

        $response = $this->getJson('/api/admin/categories');
        $response->assertStatus(403);
    }

    public function test_admin_can_list_and_create_categories(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $createResponse = $this->postJson('/api/admin/categories', [
            'name' => 'Electronics',
            'description' => 'Gadgets and hardware',
        ]);

        $createResponse->assertStatus(201)
            ->assertJson([
                'category' => [
                    'name' => 'Electronics',
                    'slug' => 'electronics',
                    'status' => 'active',
                ],
            ]);

        $listResponse = $this->getJson('/api/admin/categories');
        $listResponse->assertStatus(200)
            ->assertJsonCount(1, 'categories');
    }

    public function test_admin_can_update_and_toggle_category_status(): void
    {
        $category = Category::create([
            'name' => 'Fashion',
            'slug' => 'fashion',
            'status' => 'active',
        ]);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $updateResponse = $this->putJson("/api/admin/categories/{$category->id}", [
            'name' => 'Fashion & Apparel',
            'description' => 'Clothing and accessories',
        ]);

        $updateResponse->assertStatus(200)
            ->assertJson([
                'category' => [
                    'id' => $category->id,
                    'name' => 'Fashion & Apparel',
                    'slug' => 'fashion-apparel',
                ],
            ]);

        $toggleResponse = $this->postJson("/api/admin/categories/{$category->id}/status");
        $toggleResponse->assertStatus(200)
            ->assertJson([
                'category' => [
                    'id' => $category->id,
                    'status' => 'inactive',
                ],
            ]);
    }

    public function test_admin_can_manage_vendor_category_requests(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'active']);

        $categoryRequest = CategoryRequest::create([
            'vendor_id' => $vendor->id,
            'name' => 'Books & Media',
            'reason' => 'We sell educational books',
            'status' => 'pending',
        ]);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $requestsList = $this->getJson('/api/admin/category-requests');
        $requestsList->assertStatus(200)
            ->assertJsonCount(1, 'requests');

        $approveResponse = $this->postJson("/api/admin/category-requests/{$categoryRequest->id}/approve");
        $approveResponse->assertStatus(200)
            ->assertJson([
                'request' => [
                    'id' => $categoryRequest->id,
                    'status' => 'approved',
                ],
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Books & Media',
            'slug' => 'books-media',
        ]);
    }
}
