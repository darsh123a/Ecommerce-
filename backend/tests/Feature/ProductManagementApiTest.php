<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductManagementApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_product_management(): void
    {
        $response = $this->getJson('/api/admin/products');
        $response->assertStatus(401);
    }

    public function test_customer_cannot_access_product_management(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $this->actingAs($customer);

        $response = $this->getJson('/api/admin/products');
        $response->assertStatus(403);
    }

    public function test_admin_can_list_products_and_vendor_ownership_is_preserved(): void
    {
        $vendor = User::factory()->create(['name' => 'Tech Vendor', 'role' => 'vendor', 'status' => 'active']);
        $category = Category::create(['name' => 'Gadgets', 'slug' => 'gadgets', 'status' => 'active']);

        $product = Product::create([
            'vendor_id' => $vendor->id,
            'category_id' => $category->id,
            'title' => 'Wireless Earbuds',
            'description' => 'High quality audio earbuds',
            'price' => 49.99,
            'status' => 'pending',
        ]);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $response = $this->getJson('/api/admin/products');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'products')
            ->assertJson([
                'products' => [
                    [
                        'id' => $product->id,
                        'title' => 'Wireless Earbuds',
                        'price' => 49.99,
                        'vendor' => [
                            'id' => $vendor->id,
                            'name' => 'Tech Vendor',
                        ],
                        'category' => [
                            'id' => $category->id,
                            'name' => 'Gadgets',
                        ],
                    ],
                ],
            ]);
    }

    public function test_admin_can_approve_and_reject_products(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'active']);

        $product = Product::create([
            'vendor_id' => $vendor->id,
            'title' => 'Smart Watch',
            'price' => 199.99,
            'status' => 'pending',
        ]);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $approveResponse = $this->postJson("/api/admin/products/{$product->id}/approve");

        $approveResponse->assertStatus(200)
            ->assertJson([
                'product' => [
                    'id' => $product->id,
                    'status' => 'active',
                ],
            ]);

        $rejectResponse = $this->postJson("/api/admin/products/{$product->id}/reject");

        $rejectResponse->assertStatus(200)
            ->assertJson([
                'product' => [
                    'id' => $product->id,
                    'status' => 'rejected',
                ],
            ]);
    }

    public function test_admin_can_toggle_product_status(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'active']);

        $product = Product::create([
            'vendor_id' => $vendor->id,
            'title' => 'Gaming Mouse',
            'price' => 29.99,
            'status' => 'active',
        ]);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $toggleResponse = $this->postJson("/api/admin/products/{$product->id}/status", [
            'status' => 'inactive',
        ]);

        $toggleResponse->assertStatus(200)
            ->assertJson([
                'product' => [
                    'id' => $product->id,
                    'status' => 'inactive',
                ],
            ]);
    }
}
