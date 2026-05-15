<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
App\Models\User::query()->update(['password' => Hash::make('password')]);
echo "All passwords reset to 'password'\n";
