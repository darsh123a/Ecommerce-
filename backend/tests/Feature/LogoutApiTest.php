<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Tests\TestCase;

class LogoutApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_logout_successfully(): void
    {
        $user = User::create([
            'name' => 'Logout User',
            'email' => 'logout@example.com',
            'password' => 'password123',
            'role' => 'customer',
            'status' => 'active',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Logged out successfully.']);

        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_revoked_token_cannot_access_protected_routes(): void
    {
        $user = User::create([
            'name' => 'Revoke User',
            'email' => 'revoke@example.com',
            'password' => 'password123',
            'role' => 'customer',
            'status' => 'active',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        // Logout to revoke token
        $logoutResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/logout');

        $logoutResponse->assertStatus(200);

        // Clear in-memory cached guards for the test environment
        Auth::forgetGuards();

        // Attempt accessing protected endpoint with the revoked token
        $protectedResponse = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/api/user');

        $protectedResponse->assertStatus(401);
    }

    public function test_unauthenticated_logout_request_is_rejected(): void
    {
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401);
    }
}
