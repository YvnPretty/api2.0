<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreLibroRequest;
use App\Http\Requests\UpdateLibroRequest;
use App\Models\Libro;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

class LibroController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Libro::all(), 200);
    }

    public function store(StoreLibroRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $libro = Libro::create($validated);

        return response()->json($libro, 201)->header('Location', route('libros.show', $libro->id));
    }

    public function show(string $id): JsonResponse
    {
        return response()->json(Libro::findOrFail($id), 200);
    }

    public function update(UpdateLibroRequest $request, string $id): JsonResponse
    {
        $libro = Libro::findOrFail($id);
        $validated = $request->validated();
        $libro->update($validated);

        return response()->json($libro, 200);
    }

    public function destroy(string $id): Response
    {
        $libro = Libro::findOrFail($id);
        $libro->delete();

        return response()->noContent();
    }
}
