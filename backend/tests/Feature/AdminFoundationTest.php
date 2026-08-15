<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminFoundationTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_request_to_admin_ping_returns_401(): void
    {
        $response = $this->getJson('/api/admin/ping');

        $response->assertStatus(401);
    }

    public function test_customer_cannot_access_admin_ping(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
            'status' => 'active',
        ]);

        $this->actingAs($customer);

        $response = $this->getJson('/api/admin/ping');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized for this role.']);
    }

    public function test_vendor_cannot_access_admin_ping(): void
    {
        $vendor = User::factory()->create([
            'role' => 'vendor',
            'status' => 'active',
        ]);

        $this->actingAs($vendor);

        $response = $this->getJson('/api/admin/ping');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized for this role.']);
    }

    public function test_admin_can_access_admin_ping(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $this->actingAs($admin);

        $response = $this->getJson('/api/admin/ping');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'message' => 'Admin API foundation is ready.',
                'user' => [
                    'email' => $admin->email,
                    'role' => 'admin',
                ],
            ]);
    }
}
