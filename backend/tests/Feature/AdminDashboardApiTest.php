<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminDashboardApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_request_to_admin_dashboard_returns_401(): void
    {
        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(401);
    }

    public function test_customer_cannot_access_admin_dashboard(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);

        $this->actingAs($customer);

        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_vendor_cannot_access_admin_dashboard(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'active']);

        $this->actingAs($vendor);

        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(403);
    }

    public function test_admin_can_fetch_dashboard_statistics(): void
    {
        // Seed users
        User::factory()->count(5)->create(['role' => 'customer', 'status' => 'active']);
        User::factory()->count(2)->create(['role' => 'vendor', 'status' => 'active']);
        User::factory()->count(1)->create(['role' => 'vendor', 'status' => 'pending']);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);

        $this->actingAs($admin);

        $response = $this->getJson('/api/admin/dashboard');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'stats' => [
                    'total_customers',
                    'total_vendors',
                    'total_products',
                    'pending_approvals',
                ],
            ])
            ->assertJson([
                'stats' => [
                    'total_customers' => 5,
                    'total_vendors' => 3,
                    'total_products' => 0,
                    'pending_approvals' => 1,
                ],
            ]);
    }
}
