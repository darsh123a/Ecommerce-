<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorInventoryApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_update_inventory(): void
    {
        $this->postJson('/api/vendor/products/1/stock', ['stock' => 10])->assertStatus(401);
    }

    public function test_customer_and_admin_cannot_update_vendor_inventory(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $this->actingAs($customer);
        $this->postJson('/api/vendor/products/1/stock', ['stock' => 10])->assertStatus(403);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);
        $this->postJson('/api/vendor/products/1/stock', ['stock' => 10])->assertStatus(403);
    }

    public function test_vendor_can_update_own_product_inventory(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'active']);

        $product = Product::create([
            'vendor_id' => $vendor->id,
            'title' => 'Mechanical Keyboard',
            'price' => 79.99,
            'stock' => 5,
            'status' => 'active',
        ]);

        $this->actingAs($vendor);

        $response = $this->postJson("/api/vendor/products/{$product->id}/stock", [
            'stock' => 50,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'product' => [
                    'id' => $product->id,
                    'stock' => 50,
                ],
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'stock' => 50,
        ]);
    }

    public function test_vendor_cannot_update_another_vendors_inventory(): void
    {
        $vendorA = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $vendorB = User::factory()->create(['role' => 'vendor', 'status' => 'active']);

        $productB = Product::create([
            'vendor_id' => $vendorB->id,
            'title' => 'Vendor B Item',
            'price' => 15,
            'stock' => 100,
            'status' => 'active',
        ]);

        $this->actingAs($vendorA);

        $response = $this->postJson("/api/vendor/products/{$productB->id}/stock", [
            'stock' => 0,
        ]);

        $response->assertStatus(404);

        $this->assertDatabaseHas('products', [
            'id' => $productB->id,
            'stock' => 100,
        ]);
    }
}
