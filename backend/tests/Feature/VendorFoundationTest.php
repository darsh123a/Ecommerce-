<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorFoundationTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_request_to_vendor_ping_returns_401(): void
    {
        $response = $this->getJson('/api/vendor/ping');

        $response->assertStatus(401);
    }

    public function test_customer_cannot_access_vendor_ping(): void
    {
        $customer = User::factory()->create([
            'role' => 'customer',
            'status' => 'active',
        ]);

        $this->actingAs($customer);

        $response = $this->getJson('/api/vendor/ping');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized for this role.']);
    }

    public function test_admin_cannot_access_vendor_ping(): void
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'status' => 'active',
        ]);

        $this->actingAs($admin);

        $response = $this->getJson('/api/vendor/ping');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized for this role.']);
    }

    public function test_vendor_can_access_vendor_ping(): void
    {
        $vendor = User::factory()->create([
            'role' => 'vendor',
            'status' => 'active',
        ]);

        $this->actingAs($vendor);

        $response = $this->getJson('/api/vendor/ping');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'message' => 'Vendor API foundation is ready.',
                'user' => [
                    'email' => $vendor->email,
                    'role' => 'vendor',
                ],
            ]);
    }
}
