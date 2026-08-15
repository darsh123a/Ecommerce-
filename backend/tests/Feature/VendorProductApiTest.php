<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorProductApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_vendor_products(): void
    {
        $this->getJson('/api/vendor/products')->assertStatus(401);
        $this->postJson('/api/vendor/products', ['title' => 'Test', 'price' => 10])->assertStatus(401);
    }

    public function test_customer_and_admin_cannot_access_vendor_products(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $this->actingAs($customer);
        $this->getJson('/api/vendor/products')->assertStatus(403);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);
        $this->getJson('/api/vendor/products')->assertStatus(403);
    }

    public function test_vendor_can_list_create_and_update_own_products(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $category = Category::create(['name' => 'Audio', 'slug' => 'audio', 'status' => 'active']);

        $this->actingAs($vendor);

        $createResponse = $this->postJson('/api/vendor/products', [
            'title' => 'Wireless Headphones',
            'description' => 'Noise cancelling headphones',
            'price' => 99.99,
            'category_id' => $category->id,
        ]);

        $createResponse->assertStatus(201)
            ->assertJson([
                'product' => [
                    'vendor_id' => $vendor->id,
                    'title' => 'Wireless Headphones',
                    'price' => 99.99,
                    'status' => 'pending',
                ],
            ]);

        $productId = $createResponse->json('product.id');

        $listResponse = $this->getJson('/api/vendor/products');
        $listResponse->assertStatus(200)
            ->assertJsonCount(1, 'products');

        $updateResponse = $this->putJson("/api/vendor/products/{$productId}", [
            'title' => 'Wireless Headphones Pro',
            'description' => 'Upgraded noise cancelling headphones',
            'price' => 129.99,
            'category_id' => $category->id,
        ]);

        $updateResponse->assertStatus(200)
            ->assertJson([
                'product' => [
                    'id' => $productId,
                    'title' => 'Wireless Headphones Pro',
                    'price' => 129.99,
                    'status' => 'pending',
                ],
            ]);
    }

    public function test_vendor_cannot_access_or_update_another_vendors_product(): void
    {
        $vendorA = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $vendorB = User::factory()->create(['role' => 'vendor', 'status' => 'active']);

        $productB = Product::create([
            'vendor_id' => $vendorB->id,
            'title' => 'Vendor B Product',
            'price' => 50,
            'status' => 'active',
        ]);

        $this->actingAs($vendorA);

        $this->getJson("/api/vendor/products/{$productB->id}")->assertStatus(404);

        $this->putJson("/api/vendor/products/{$productB->id}", [
            'title' => 'Hacked Title',
            'price' => 1,
        ])->assertStatus(404);
    }
}
