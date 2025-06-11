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
        Schema::create('ajustements_stock', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mouvement_stock_id')->constrained('mouvements_stock')->onDelete('cascade');
            $table->string('raison');
            $table->text('details')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ajustement_stocks');
    }
};
