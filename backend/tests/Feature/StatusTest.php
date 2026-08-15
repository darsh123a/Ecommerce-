<?php

namespace Tests\Feature;

use Tests\TestCase;

class StatusTest extends TestCase
{
    public function test_api_status_endpoint_returns_success_and_database_info(): void
    {
        $response = $this->getJson('/api/status');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'app',
                'environment',
                'database' => [
                    'status',
                    'name',
                    'driver',
                ],
                'timestamp',
            ])
            ->assertJsonPath('status', 'ok')
            ->assertJsonPath('database.status', 'connected');
    }
}
