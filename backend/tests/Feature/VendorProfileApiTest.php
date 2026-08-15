<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorProfileApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_vendor_profile(): void
    {
        $this->getJson('/api/vendor/profile')->assertStatus(401);
        $this->putJson('/api/vendor/profile', ['name' => 'New Name', 'email' => 'new@vendor.com'])->assertStatus(401);
    }

    public function test_customer_and_admin_cannot_access_vendor_profile(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $this->actingAs($customer);
        $this->getJson('/api/vendor/profile')->assertStatus(403);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);
        $this->getJson('/api/vendor/profile')->assertStatus(403);
    }

    public function test_vendor_can_view_and_update_own_profile(): void
    {
        $vendor = User::factory()->create([
            'name' => 'Original Vendor',
            'email' => 'original@vendor.com',
            'role' => 'vendor',
            'status' => 'active',
        ]);

        $this->actingAs($vendor);

        $viewResponse = $this->getJson('/api/vendor/profile');
        $viewResponse->assertStatus(200)
            ->assertJson([
                'user' => [
                    'id' => $vendor->id,
                    'name' => 'Original Vendor',
                    'email' => 'original@vendor.com',
                    'role' => 'vendor',
                ],
            ]);

        $updateResponse = $this->putJson('/api/vendor/profile', [
            'name' => 'Updated Vendor Corp',
            'email' => 'updated@vendor.com',
        ]);

        $updateResponse->assertStatus(200)
            ->assertJson([
                'user' => [
                    'id' => $vendor->id,
                    'name' => 'Updated Vendor Corp',
                    'email' => 'updated@vendor.com',
                    'role' => 'vendor',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $vendor->id,
            'name' => 'Updated Vendor Corp',
            'email' => 'updated@vendor.com',
        ]);
    }
}
