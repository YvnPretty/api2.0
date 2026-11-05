<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLibroRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'titulo' => 'sometimes|required|string|max:255',
            'autor' => 'sometimes|required|string|max:255',
            'genero' => 'sometimes|nullable|string|max:255',
            'anio_publicacion' => 'sometimes|nullable|integer',
        ];
    }
}
