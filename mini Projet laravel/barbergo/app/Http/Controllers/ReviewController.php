<?php

namespace App\Http\Controllers;

use App\Http\Requests\ReviewRequest;
use App\Models\Review;
use App\Models\Hairdresser;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index($hairdresserId)
    {
        $reviews = Review::where('hairdresser_id', $hairdresserId)
            ->with('client')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $reviews
        ]);
    }

    public function store(ReviewRequest $request)
    {
        $review = Review::create([
            'client_id' => $request->user()->id,
            'hairdresser_id' => $request->hairdresser_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        // Update hairdresser average rating
        $hairdresser = Hairdresser::find($request->hairdresser_id);
        $avgRating = Review::where('hairdresser_id', $hairdresser->id)->avg('rating');
        $hairdresser->update(['rating' => $avgRating]);

        return response()->json([
            'status' => 201,
            'message' => 'Review added successfully.',
            'data' => $review
        ], 201);
    }
}
