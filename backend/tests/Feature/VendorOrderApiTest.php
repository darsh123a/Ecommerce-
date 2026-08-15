<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorOrderApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_vendor_orders(): void
    {
        $this->getJson('/api/vendor/orders')->assertStatus(401);
        $this->getJson('/api/vendor/orders/1')->assertStatus(401);
        $this->postJson('/api/vendor/orders/1/status', ['status' => 'processing'])->assertStatus(401);
    }

    public function test_customer_and_admin_cannot_access_vendor_orders(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $this->actingAs($customer);
        $this->getJson('/api/vendor/orders')->assertStatus(403);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);
        $this->getJson('/api/vendor/orders')->assertStatus(403);
    }

    public function test_vendor_can_list_and_view_orders_containing_own_products(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $otherVendor = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);

        $ownProduct = Product::create([
            'vendor_id' => $vendor->id,
            'title' => 'Vendor A Product',
            'price' => 20,
            'stock' => 10,
            'status' => 'active',
        ]);

        $otherProduct = Product::create([
            'vendor_id' => $otherVendor->id,
            'title' => 'Vendor B Product',
            'price' => 30,
            'stock' => 5,
            'status' => 'active',
        ]);

        $ownOrder = Order::create([
            'customer_id' => $customer->id,
            'order_number' => 'ORD-OWN-001',
            'total_amount' => 40,
            'status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $ownOrder->id,
            'product_id' => $ownProduct->id,
            'vendor_id' => $vendor->id,
            'quantity' => 2,
            'unit_price' => 20,
            'subtotal' => 40,
        ]);

        $otherOrder = Order::create([
            'customer_id' => $customer->id,
            'order_number' => 'ORD-OTHER-001',
            'total_amount' => 30,
            'status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $otherOrder->id,
            'product_id' => $otherProduct->id,
            'vendor_id' => $otherVendor->id,
            'quantity' => 1,
            'unit_price' => 30,
            'subtotal' => 30,
        ]);

        $this->actingAs($vendor);

        $listResponse = $this->getJson('/api/vendor/orders');
        $listResponse->assertStatus(200)
            ->assertJsonCount(1, 'orders')
            ->assertJsonPath('orders.0.id', $ownOrder->id)
            ->assertJsonPath('orders.0.order_number', 'ORD-OWN-001');

        $showResponse = $this->getJson("/api/vendor/orders/{$ownOrder->id}");
        $showResponse->assertStatus(200)
            ->assertJsonPath('order.id', $ownOrder->id)
            ->assertJsonCount(1, 'order.items');

        $this->getJson("/api/vendor/orders/{$otherOrder->id}")->assertStatus(404);
    }

    public function test_vendor_can_update_fulfillment_status(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);

        $product = Product::create([
            'vendor_id' => $vendor->id,
            'title' => 'Fulfillment Item',
            'price' => 15,
            'stock' => 8,
            'status' => 'active',
        ]);

        $order = Order::create([
            'customer_id' => $customer->id,
            'order_number' => 'ORD-FULFILL-001',
            'total_amount' => 15,
            'status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'vendor_id' => $vendor->id,
            'quantity' => 1,
            'unit_price' => 15,
            'subtotal' => 15,
        ]);

        $this->actingAs($vendor);

        foreach (['processing', 'shipped', 'delivered'] as $status) {
            $response = $this->postJson("/api/vendor/orders/{$order->id}/status", [
                'status' => $status,
            ]);

            $response->assertStatus(200)
                ->assertJsonPath('order.status', $status);

            $this->assertDatabaseHas('orders', [
                'id' => $order->id,
                'status' => $status,
            ]);
        }
    }

    public function test_vendor_cannot_set_cancelled_status(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);

        $product = Product::create([
            'vendor_id' => $vendor->id,
            'title' => 'Cancel Attempt Item',
            'price' => 12,
            'stock' => 3,
            'status' => 'active',
        ]);

        $order = Order::create([
            'customer_id' => $customer->id,
            'order_number' => 'ORD-CANCEL-001',
            'total_amount' => 12,
            'status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'vendor_id' => $vendor->id,
            'quantity' => 1,
            'unit_price' => 12,
            'subtotal' => 12,
        ]);

        $this->actingAs($vendor);

        $response = $this->postJson("/api/vendor/orders/{$order->id}/status", [
            'status' => 'cancelled',
        ]);

        $response->assertStatus(422);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'pending',
        ]);
    }

    public function test_vendor_cannot_update_another_vendors_order_status(): void
    {
        $vendorA = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $vendorB = User::factory()->create(['role' => 'vendor', 'status' => 'active']);
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);

        $productB = Product::create([
            'vendor_id' => $vendorB->id,
            'title' => 'Vendor B Only',
            'price' => 25,
            'stock' => 4,
            'status' => 'active',
        ]);

        $orderB = Order::create([
            'customer_id' => $customer->id,
            'order_number' => 'ORD-B-001',
            'total_amount' => 25,
            'status' => 'pending',
        ]);

        OrderItem::create([
            'order_id' => $orderB->id,
            'product_id' => $productB->id,
            'vendor_id' => $vendorB->id,
            'quantity' => 1,
            'unit_price' => 25,
            'subtotal' => 25,
        ]);

        $this->actingAs($vendorA);

        $response = $this->postJson("/api/vendor/orders/{$orderB->id}/status", [
            'status' => 'processing',
        ]);

        $response->assertStatus(404);

        $this->assertDatabaseHas('orders', [
            'id' => $orderB->id,
            'status' => 'pending',
        ]);
    }
}
