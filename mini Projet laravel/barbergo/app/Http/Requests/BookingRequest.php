<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class BookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'hairdresser_id' => ['required', 'exists:hairdressers,id'],
            'address' => ['required', 'string', 'max:255'],
            'booking_date' => ['required', 'date', 'after:now'],
            'service_ids' => ['required', 'array', 'min:1'],
            'service_ids.*' => ['required', 'exists:services,id'],
        ];
    }
}
