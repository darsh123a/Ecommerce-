<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_successful_customer_login(): void
    {
        $user = User::create([
            'name' => 'Customer John',
            'email' => 'customer@example.com',
            'password' => 'secret1234',
            'role' => 'customer',
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'customer@example.com',
            'password' => 'secret1234',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'token',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'role',
                    'status',
                ],
            ])
            ->assertJsonPath('message', 'Login successful.')
            ->assertJsonPath('user.email', 'customer@example.com')
            ->assertJsonPath('user.role', 'customer')
            ->assertJsonPath('user.status', 'active');

        $this->assertNotEmpty($response->json('token'));
    }

    public function test_successful_vendor_login(): void
    {
        User::create([
            'name' => 'Vendor Store',
            'email' => 'vendor@store.com',
            'password' => 'vendorpass123',
            'role' => 'vendor',
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'vendor@store.com',
            'password' => 'vendorpass123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('user.role', 'vendor')
            ->assertJsonPath('user.status', 'active');
    }

    public function test_successful_admin_login(): void
    {
        User::create([
            'name' => 'Admin Super',
            'email' => 'admin@marketplace.com',
            'password' => 'adminpass123',
            'role' => 'admin',
            'status' => 'active',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'admin@marketplace.com',
            'password' => 'adminpass123',
        ]);

        $response->assertStatus(200)
            ->assertJsonPath('user.role', 'admin')
            ->assertJsonPath('user.status', 'active');
    }

    public function test_login_with_incorrect_password_returns_generic_error(): void
    {
        User::create([
            'name' => 'Customer John',
            'email' => 'john@example.com',
            'password' => 'correctpassword',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'john@example.com',
            'password' => 'wrongpassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid credentials.']);
    }

    public function test_login_with_non_existent_email_returns_generic_error(): void
    {
        $response = $this->postJson('/api/login', [
            'email' => 'nonexistent@example.com',
            'password' => 'somepassword',
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid credentials.']);
    }

    public function test_inactive_or_suspended_user_cannot_login(): void
    {
        User::create([
            'name' => 'Suspended Vendor',
            'email' => 'suspended@vendor.com',
            'password' => 'password123',
            'role' => 'vendor',
            'status' => 'suspended',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'suspended@vendor.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(403)
            ->assertJson(['message' => 'Your account is inactive or suspended.']);
    }

    public function test_login_validation_errors(): void
    {
        $response = $this->postJson('/api/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    public function test_login_response_does_not_expose_sensitive_password_data(): void
    {
        User::create([
            'name' => 'Customer Safe',
            'email' => 'safe@example.com',
            'password' => 'secretpass',
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'safe@example.com',
            'password' => 'secretpass',
        ]);

        $response->assertStatus(200);

        $json = $response->json();
        $this->assertArrayNotHasKey('password', $json['user']);
        $this->assertArrayNotHasKey('remember_token', $json['user']);
        $this->assertStringNotContainsString('secretpass', $response->getContent());
    }
}
