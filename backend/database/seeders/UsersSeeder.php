<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        // Responsable Stock
        User::create([
            'name' => 'Responsable Stock',
            'email' => 'responsablestock@example.com',
            'password' => Hash::make('123456789'),
            'role' => 'ResponsableStock',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Gestionnaire Produits
        User::create([
            'name' => 'Gestionnaire Produits',
            'email' => 'gestionnaireproduits@example.com',
            'password' => Hash::make('123456789'),
            'role' => 'GestionnaireProduits',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Responsable Commandes
        User::create([
            'name' => 'Responsable Commandes',
            'email' => 'responsablecommandes@example.com',
            'password' => Hash::make('123456789'),
            'role' => 'ResponsableCommandes',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Responsable Achats
        User::create([
            'name' => 'Responsable Achats',
            'email' => 'responsableachats@example.com',
            'password' => Hash::make('123456789'),
            'role' => 'ResponsableAchats',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Responsable Ventes
        User::create([
            'name' => 'Responsable Ventes',
            'email' => 'responsableventes@example.com',
            'password' => Hash::make('123456789'),
            'role' => 'ResponsableVentes',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Responsable Catégories
        User::create([
            'name' => 'Responsable Catégories',
            'email' => 'responsablecategories@example.com',
            'password' => Hash::make('123456789'),
            'role' => 'ResponsableCategories',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Caissier
        User::create([
            'name' => 'Caissier',
            'email' => 'caissier@example.com',
            'password' => Hash::make('123456789'),
            'role' => 'Caissier',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Analyste
        User::create([
            'name' => 'Analyste',
            'email' => 'analyste@example.com',
            'password' => Hash::make('123456789'),
            'role' => 'Analyste',
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
