<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorDashboardApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_request_cannot_access_vendor_dashboard(): void
    {
        $response = $this->getJson('/api/vendor/dashboard');
        $response->assertStatus(401);
    }

    public function test_customer_and_admin_cannot_access_vendor_dashboard(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $this->actingAs($customer);
        $this->getJson('/api/vendor/dashboard')->assertStatus(403);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);
        $this->getJson('/api/vendor/dashboard')->assertStatus(403);
    }

    public function test_vendor_sees_only_own_product_dashboard_statistics(): void
    {
        $vendorA = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $vendorB = User::factory()->create(['role' => 'vendor', 'status' => 'active']);

        // Vendor A products
        Product::create(['vendor_id' => $vendorA->id, 'title' => 'Product A1', 'price' => 10, 'status' => 'active']);
        Product::create(['vendor_id' => $vendorA->id, 'title' => 'Product A2', 'price' => 20, 'status' => 'pending']);

        // Vendor B products
        Product::create(['vendor_id' => $vendorB->id, 'title' => 'Product B1', 'price' => 30, 'status' => 'active']);
        Product::create(['vendor_id' => $vendorB->id, 'title' => 'Product B2', 'price' => 40, 'status' => 'active']);

        $this->actingAs($vendorA);

        $response = $this->getJson('/api/vendor/dashboard');

        $response->assertStatus(200)
            ->assertJson([
                'stats' => [
                    'total_products' => 2,
                    'active_products' => 1,
                    'pending_products' => 1,
                    'vendor_orders' => 0,
                ],
            ]);
    }

    public function test_vendor_dashboard_counts_only_orders_containing_own_products(): void
    {
        $vendorA = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $vendorB = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);

        $productA = Product::create([
            'vendor_id' => $vendorA->id,
            'title' => 'A Item',
            'price' => 10,
            'stock' => 5,
            'status' => 'active',
        ]);
        $productB = Product::create([
            'vendor_id' => $vendorB->id,
            'title' => 'B Item',
            'price' => 20,
            'stock' => 5,
            'status' => 'active',
        ]);

        $sharedOrder = Order::create([
            'customer_id' => $customer->id,
            'order_number' => 'ORD-SHARED-1',
            'total_amount' => 30,
            'status' => 'pending',
        ]);
        OrderItem::create([
            'order_id' => $sharedOrder->id,
            'product_id' => $productA->id,
            'vendor_id' => $vendorA->id,
            'quantity' => 1,
            'unit_price' => 10,
            'subtotal' => 10,
        ]);
        OrderItem::create([
            'order_id' => $sharedOrder->id,
            'product_id' => $productB->id,
            'vendor_id' => $vendorB->id,
            'quantity' => 1,
            'unit_price' => 20,
            'subtotal' => 20,
        ]);

        $otherOrder = Order::create([
            'customer_id' => $customer->id,
            'order_number' => 'ORD-B-ONLY',
            'total_amount' => 20,
            'status' => 'pending',
        ]);
        OrderItem::create([
            'order_id' => $otherOrder->id,
            'product_id' => $productB->id,
            'vendor_id' => $vendorB->id,
            'quantity' => 1,
            'unit_price' => 20,
            'subtotal' => 20,
        ]);

        $this->actingAs($vendorA);

        $this->getJson('/api/vendor/dashboard')
            ->assertStatus(200)
            ->assertJsonPath('stats.vendor_orders', 1);
    }
}
