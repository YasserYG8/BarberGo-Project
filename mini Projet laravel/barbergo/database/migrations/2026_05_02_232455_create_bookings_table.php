<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('hairdresser_id')->constrained('hairdressers')->onDelete('cascade');
            $table->string('address');
            $table->dateTime('booking_date');
            $table->decimal('total', 8, 2);
            $table->enum('status', ['pending', 'confirmed', 'on_way', 'arrived', 'in_progress', 'done', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
