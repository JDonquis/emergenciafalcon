<?php

namespace Database\Seeders;

use App\Services\EmergencyCaseService;
use DB;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call([

            RoleSeeder::class,
            SpecialtySeeder::class,
            UserSeeder::class,
            AreaSeeder::class,
            EmergencyCaseSeeder::class,
        ]);
    }

    
}
