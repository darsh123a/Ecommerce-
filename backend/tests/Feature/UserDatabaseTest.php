<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserDatabaseTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_creation_with_defaults(): void
    {
        $user = User::create([
            'name' => 'John Customer',
            'email' => 'john@example.com',
            'password' => 'secret123',
        ]);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'John Customer',
            'email' => 'john@example.com',
            'role' => 'customer',
            'status' => 'active',
        ]);

        $this->assertTrue(Hash::check('secret123', $user->password));
        $this->assertNotEquals('secret123', $user->password);
    }

    public function test_user_creation_with_specific_roles_and_statuses(): void
    {
        $vendor = User::create([
            'name' => 'Vendor Store',
            'email' => 'vendor@store.com',
            'password' => 'vendorpass123',
            'role' => 'vendor',
            'status' => 'pending',
        ]);

        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@marketplace.com',
            'password' => 'adminpass123',
            'role' => 'admin',
            'status' => 'active',
        ]);

        $this->assertEquals('vendor', $vendor->role);
        $this->assertEquals('pending', $vendor->status);

        $this->assertEquals('admin', $admin->role);
        $this->assertEquals('active', $admin->status);

        $this->assertDatabaseHas('users', [
            'email' => 'vendor@store.com',
            'role' => 'vendor',
            'status' => 'pending',
        ]);

        $this->assertDatabaseHas('users', [
            'email' => 'admin@marketplace.com',
            'role' => 'admin',
            'status' => 'active',
        ]);
    }

    public function test_email_uniqueness_constraint(): void
    {
        User::create([
            'name' => 'User One',
            'email' => 'duplicate@example.com',
            'password' => 'pass1234',
        ]);

        $this->expectException(QueryException::class);

        User::create([
            'name' => 'User Two',
            'email' => 'duplicate@example.com',
            'password' => 'pass5678',
        ]);
    }
}
