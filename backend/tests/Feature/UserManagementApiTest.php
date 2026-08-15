<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_user_cannot_access_user_management(): void
    {
        $response = $this->getJson('/api/admin/users');
        $response->assertStatus(401);
    }

    public function test_customer_cannot_access_user_management(): void
    {
        $customer = User::factory()->create(['role' => 'customer', 'status' => 'active']);
        $this->actingAs($customer);

        $response = $this->getJson('/api/admin/users');
        $response->assertStatus(403);
    }

    public function test_admin_can_list_users_without_exposing_passwords(): void
    {
        User::factory()->count(3)->create();

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $response = $this->getJson('/api/admin/users');

        $response->assertStatus(200)
            ->assertJsonCount(4, 'users')
            ->assertJsonMissing(['password']);
    }

    public function test_admin_can_view_user_details(): void
    {
        $user = User::factory()->create(['name' => 'Alice Smith', 'role' => 'customer', 'status' => 'active']);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $response = $this->getJson("/api/admin/users/{$user->id}");

        $response->assertStatus(200)
            ->assertJson([
                'user' => [
                    'id' => $user->id,
                    'name' => 'Alice Smith',
                    'role' => 'customer',
                    'status' => 'active',
                ],
            ])
            ->assertJsonMissing(['password']);
    }

    public function test_admin_can_activate_and_deactivate_user(): void
    {
        $user = User::factory()->create(['role' => 'customer', 'status' => 'active']);

        $admin = User::factory()->create(['role' => 'admin', 'status' => 'active']);
        $this->actingAs($admin);

        $deactivateResponse = $this->postJson("/api/admin/users/{$user->id}/status", [
            'status' => 'inactive',
        ]);

        $deactivateResponse->assertStatus(200)
            ->assertJson([
                'user' => [
                    'id' => $user->id,
                    'status' => 'inactive',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'status' => 'inactive',
        ]);
    }
}
