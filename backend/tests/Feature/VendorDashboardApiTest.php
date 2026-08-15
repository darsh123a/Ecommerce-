<?php

namespace Tests\Feature;

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
}
