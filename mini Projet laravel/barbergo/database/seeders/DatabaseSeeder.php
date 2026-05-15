<?php

namespace Database\Seeders;

use App\Models\Hairdresser;
use App\Models\Service;
use App\Models\Availability;
use App\Models\Booking;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $faker = Faker::create('fr_FR');
        $password = Hash::make('password12');

        // Admin
        User::firstOrCreate(['email' => 'admin@barbergo.test'], [
            'name'     => 'Admin User',
            'password' => $password,
            'role'     => 'admin',
            'gender'   => 'male',
        ]);

        // Client
        User::firstOrCreate(['email' => 'client@barbergo.test'], [
            'name'     => 'Jane Client',
            'password' => $password,
            'role'     => 'client',
            'gender'   => 'female',
            'phone'    => '+21600000001',
            'address'  => '12 Rue du Lac, Tunis',
        ]);

        // Hairdresser
        $hairdresserUser = User::firstOrCreate(['email' => 'hairdresser@barbergo.test'], [
            'name'     => 'Ali Coiffeur',
            'password' => $password,
            'role'     => 'hairdresser',
            'gender'   => 'male',
            'phone'    => '+21600000002',
            'address'  => '45 Avenue Bourguiba, Tunis',
        ]);

        $mainHd = Hairdresser::firstOrCreate(['user_id' => $hairdresserUser->id], [
            'bio'          => 'Spécialiste dégradés et barbe, 8 ans d\'expérience.',
            'rating'       => 4.9,
            'is_validated' => true,
        ]);

        Service::firstOrCreate([
            'hairdresser_id' => $mainHd->id,
            'name'           => 'Coupe Classique Homme',
        ], [
            'price'          => 50.00,
            'duration_minutes'=> 30,
            'gender_target'  => 'male',
        ]);

        Availability::firstOrCreate([
            'hairdresser_id' => $mainHd->id,
            'day_of_week'    => 'mon',
        ], [
            'start_time'     => '09:00:00',
            'end_time'       => '18:00:00',
        ]);

        // Generate 5 random clients
        for ($i = 0; $i < 10; $i++) {
            User::create([
                'name'     => $faker->name,
                'email'    => $faker->unique()->safeEmail,
                'password' => $password,
                'role'     => 'client',
                'gender'   => $faker->randomElement(['male', 'female']),
                'phone'    => $faker->phoneNumber,
                'address'  => $faker->address,
            ]);
        }

        // Generate 5 random Hairdressers with services and availabilities
        for ($i = 0; $i < 10; $i++) {
            $hdUser = User::create([
                'name'     => $faker->name,
                'email'    => $faker->unique()->safeEmail,
                'password' => $password,
                'role'     => 'hairdresser',
                'gender'   => $faker->randomElement(['male', 'female']),
                'phone'    => $faker->phoneNumber,
                'address'  => $faker->address,
            ]);

            $hd = Hairdresser::create([
                'user_id'      => $hdUser->id,
                'bio'          => $faker->realText(100),
                'rating'       => $faker->randomFloat(1, 3, 5),
                'is_validated' => $faker->boolean(80), // 80% chance of being validated
            ]);

            // Add Services
            for ($j = 0; $j < 3; $j++) {
                Service::create([
                    'hairdresser_id' => $hd->id,
                    'name'           => $faker->randomElement(['Coupe Classique', 'Dégradé à blanc', 'Taille de Barbe', 'Coloration', 'Brushing', 'Coupe Enfant', 'Soin Visage']),
                    'price'          => $faker->randomFloat(2, 20, 150),
                    'duration_minutes'=> $faker->randomElement([30, 45, 60]),
                    'gender_target'  => $faker->randomElement(['male', 'female', 'both']),
                ]);
            }

            // Add Availabilities
            $days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            $randomDays = $faker->randomElements($days, 4);
            foreach ($randomDays as $day) {
                Availability::create([
                    'hairdresser_id' => $hd->id,
                    'day_of_week'    => $day,
                    'start_time'     => '09:00:00',
                    'end_time'       => '18:00:00',
                ]);
            }
        }
    }
}
