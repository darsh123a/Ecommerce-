<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VendorManagementApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_vendor_management(): void
    {
        $response = $this->getJson('/api/admin/vendors');
        $response->assertStatus(401);
    }

    public function test_customer_cannot_access_vendor_management(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $this->actingAs($customer);

        $response = $this->getJson('/api/admin/vendors');
        $response->assertStatus(403);
    }

    public function test_admin_can_list_vendors(): void
    {
        User::factory()->count(3)->create(['role' => 'vendor', 'status' => 'active']);
        User::factory()->create(['role' => 'customer', 'status' => 'active']); // Should be excluded

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $response = $this->getJson('/api/admin/vendors');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'vendors');
    }

    public function test_admin_can_view_vendor_details(): void
    {
        $vendor = User::factory()->create(['name' => 'Acme Vendor', 'role' => 'vendor', 'status' => 'pending']);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $response = $this->getJson("/api/admin/vendors/{$vendor->id}");

        $response->assertStatus(200)
            ->assertJson([
                'vendor' => [
                    'id' => $vendor->id,
                    'name' => 'Acme Vendor',
                    'role' => 'vendor',
                    'status' => 'pending',
                ],
            ]);
    }

    public function test_admin_can_approve_vendor(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'pending']);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $response = $this->postJson("/api/admin/vendors/{$vendor->id}/approve");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Vendor approved successfully.',
                'vendor' => [
                    'id' => $vendor->id,
                    'status' => 'active',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $vendor->id,
            'status' => 'active',
        ]);
    }

    public function test_admin_can_reject_vendor(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'pending']);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $response = $this->postJson("/api/admin/vendors/{$vendor->id}/reject");

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'Vendor rejected.',
                'vendor' => [
                    'id' => $vendor->id,
                    'status' => 'rejected',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $vendor->id,
            'status' => 'rejected',
        ]);
    }

    public function test_admin_can_activate_or_deactivate_vendor(): void
    {
        $vendor = User::factory()->create(['role' => 'vendor', 'status' => 'active']);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $deactivateResponse = $this->postJson("/api/admin/vendors/{$vendor->id}/status", [
            'status' => 'inactive',
        ]);

        $deactivateResponse->assertStatus(200)
            ->assertJson([
                'vendor' => [
                    'id' => $vendor->id,
                    'status' => 'inactive',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $vendor->id,
            'status' => 'inactive',
        ]);
    }
}
