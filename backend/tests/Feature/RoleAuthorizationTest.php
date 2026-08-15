<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_protected_routes(): void
    {
        $response = $this->getJson('/api/customer/dashboard');

        $response->assertStatus(401);
    }

    public function test_customer_can_access_customer_dashboard_but_not_admin(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
            'status' => 'active',
        ]);

        $this->actingAs($customer);

        $customerResponse = $this->getJson('/api/customer/dashboard');
        $customerResponse->assertStatus(200)
            ->assertJson(['message' => 'Customer area']);

        $adminResponse = $this->getJson('/api/admin/dashboard');
        $adminResponse->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized for this role.']);
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $this->actingAs($admin);

        $response = $this->getJson('/api/admin/dashboard');
        $response->assertStatus(200)
            ->assertJsonStructure(['stats' => ['total_customers', 'total_vendors', 'total_products', 'pending_approvals']]);
    }

    public function test_inactive_user_is_blocked_by_role_middleware(): void
    {
        $inactiveCustomer = User::factory()->create([
            'role' => 'customer',
            'status' => 'inactive',
        ]);

        $this->actingAs($inactiveCustomer);

        $response = $this->getJson('/api/customer/dashboard');
        $response->assertStatus(403)
            ->assertJson(['message' => 'Your account is inactive or suspended.']);
    }
}
