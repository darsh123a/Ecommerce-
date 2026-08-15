<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        User::updateOrCreate(
            ['email' => 'admin@lyzo.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('Admin@12345'),
                'role' => 'admin',
                'status' => 'active',
            ]
        );

        // Customer User
        User::updateOrCreate(
            ['email' => 'customer@lyzo.com'],
            [
                'name' => 'Customer User',
                'password' => Hash::make('Customer@12345'),
                'role' => 'customer',
                'status' => 'active',
            ]
        );

        // Vendor User
        User::updateOrCreate(
            ['email' => 'vendor@lyzo.com'],
            [
                'name' => 'Vendor User',
                'password' => Hash::make('Vendor@12345'),
                'role' => 'vendor',
                'status' => 'active',
            ]
        );
    }
}
