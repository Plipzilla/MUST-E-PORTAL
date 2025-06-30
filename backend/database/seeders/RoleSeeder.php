<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run()
    {
        // Create permissions
        $permissions = [
            'view applications',
            'create applications',
            'edit applications',
            'delete applications',
            'review applications',
            'approve applications',
            'reject applications',
            'manage users',
            'manage roles',
            'view reports'
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create roles
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $userRole = Role::firstOrCreate(['name' => 'user']);

        // Assign permissions to roles
        $adminRole->syncPermissions($permissions);

        $userRole->syncPermissions([
            'view applications',
            'create applications',
            'edit applications'
        ]);

        // Create sample users
        $admin = User::firstOrCreate(
            ['email' => 'admin@must.ac.mw'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]
        );
        $admin->assignRole('admin');



        $this->command->info('Roles, permissions, and sample users created successfully!');
    }
} 