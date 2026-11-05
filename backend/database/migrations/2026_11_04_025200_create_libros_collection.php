<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use MongoDB\Laravel\Schema\Blueprint;

return new class extends Migration
{
    protected $connection = 'mongodb';

    public function up(): void
    {
        if (! Schema::connection('mongodb')->hasCollection('libros')) {
            Schema::connection('mongodb')->create('libros', function (Blueprint $collection): void {
                $collection->index('titulo');
            });
        }
    }

    public function down(): void
    {
        Schema::connection('mongodb')->dropIfExists('libros');
    }
};
