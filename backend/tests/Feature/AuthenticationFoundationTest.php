<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

class AuthenticationFoundationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Route::middleware(['auth:sanctum', 'role:customer'])->get('/test-customer-route', function () {
            return response()->json(['message' => 'Customer Access Granted']);
        });

        Route::middleware(['auth:sanctum', 'role:vendor'])->get('/test-vendor-route', function () {
            return response()->json(['message' => 'Vendor Access Granted']);
        });

        Route::middleware(['auth:sanctum', 'role:admin'])->get('/test-admin-route', function () {
            return response()->json(['message' => 'Admin Access Granted']);
        });
    }

    public function test_auth_attempt_credential_verification(): void
    {
        User::create([
            'name' => 'Alice Customer',
            'email' => 'alice@example.com',
            'password' => 'secret123',
            'role' => 'customer',
        ]);

        $this->assertTrue(Auth::attempt([
            'email' => 'alice@example.com',
            'password' => 'secret123',
        ]));

        $this->assertFalse(Auth::attempt([
            'email' => 'alice@example.com',
            'password' => 'wrongpassword',
        ]));

        $this->assertFalse(Auth::attempt([
            'email' => 'nonexistent@example.com',
            'password' => 'secret123',
        ]));
    }

    public function test_user_model_role_and_status_helpers(): void
    {
        $customer = User::create([
            'name' => 'Customer User',
            'email' => 'cust@example.com',
            'password' => 'pass1234',
            'role' => 'customer',
            'status' => 'active',
        ]);

        $vendor = User::create([
            'name' => 'Vendor User',
            'email' => 'vend@example.com',
            'password' => 'pass1234',
            'role' => 'vendor',
            'status' => 'pending',
        ]);

        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'adm@example.com',
            'password' => 'pass1234',
            'role' => 'admin',
            'status' => 'active',
        ]);

        $this->assertTrue($customer->isCustomer());
        $this->assertFalse($customer->isVendor());
        $this->assertTrue($customer->hasRole('customer'));
        $this->assertTrue($customer->isActive());

        $this->assertTrue($vendor->isVendor());
        $this->assertFalse($vendor->isAdmin());
        $this->assertTrue($vendor->hasRole(['vendor', 'admin']));
        $this->assertFalse($vendor->isActive());

        $this->assertTrue($admin->isAdmin());
        $this->assertFalse($admin->isCustomer());
        $this->assertTrue($admin->isActive());
    }

    public function test_sanctum_token_creation_and_bearer_auth(): void
    {
        $user = User::create([
            'name' => 'Bob Customer',
            'email' => 'bob@example.com',
            'password' => 'bobpassword',
            'role' => 'customer',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        $this->assertNotEmpty($token);

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->getJson('/test-customer-route');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Customer Access Granted']);
    }

    public function test_role_middleware_blocks_unauthorized_role(): void
    {
        $customer = User::create([
            'name' => 'Customer Only',
            'email' => 'custonly@example.com',
            'password' => 'password123',
            'role' => 'customer',
        ]);

        $response = $this->actingAs($customer, 'sanctum')
            ->getJson('/test-vendor-route');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Unauthorized for this role.']);
    }

    public function test_role_middleware_blocks_inactive_user(): void
    {
        $suspendedAdmin = User::create([
            'name' => 'Suspended Admin',
            'email' => 'suspended@example.com',
            'password' => 'password123',
            'role' => 'admin',
            'status' => 'suspended',
        ]);

        $response = $this->actingAs($suspendedAdmin, 'sanctum')
            ->getJson('/test-admin-route');

        $response->assertStatus(403)
            ->assertJson(['message' => 'Your account is inactive or suspended.']);
    }

    public function test_unauthenticated_access_is_rejected(): void
    {
        $response = $this->getJson('/test-customer-route');

        $response->assertStatus(401);
    }
}
