<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use App\Jobs\GeneratePropertyRecommendations;
use OpenApi\Annotations as OA;

class PropertyController extends Controller
{
/**
 * @OA\Get(
 *     path="/api/properties",
 *     summary="Get all properties",
 *     tags={"Properties"},
 *     @OA\Response(
 *         response=200,
 *         description="List of properties"
 *     )
 * )
 * @OA\Post(
 *     path="/api/properties",
 *     summary="Add a new property",
 *     tags={"Properties"},
 *     @OA\RequestBody(
 *         description="Property information",
 *         required=true,
 *         @OA\JsonContent(
 *             type="object",
 *             required={"agent_id", "title", "price", "address"},
 *             @OA\Property(property="agent_id", type="integer", example=1),
 *             @OA\Property(property="title", type="string", example="Luxury Villa"),
 *             @OA\Property(property="price", type="number", example=1000000),
 *             @OA\Property(property="address", type="string", example="123 Street, City, State"),
 *             @OA\Property(property="description", type="string", example="A beautiful villa with all amenities"),
 *         ),
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Property created successfully"
 *     ),
 *     @OA\Response(
 *         response=422,
 *         description="Validation error"
 *     )
 * )
 * @OA\Get(
 *     path="/api/properties/{id}",
 *     summary="Get a single property",
 *     tags={"Properties"},
 *     @OA\Parameter(
 *         description="Property ID",
 *         in="path",
 *         name="id",
 *         required=true,
 *         example=1,
 *         @OA\Schema(
 *             type="integer",
 *             format="int64"
 *         )
 *     ),
 *     @OA\Response(
 *         response=200,
 *         description="Property details"
 *     ),
 *     @OA\Response(
 *         response=404,
 *         description="Property not found"
 *     )
 * )
 */
    // List all properties with pagination
    public function index()
    {
        $properties = Property::orderBy('created_at', 'desc')->paginate(9);
        return response()->json($properties);
    }

    // Create a new property
    public function store(Request $request)
    {
        $validated = $request->validate([
            'agent_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'address' => 'required|string|max:255',
        ]);

        $property = Property::create($validated);

        // Dispatch job for OpenAI recommendations
        GeneratePropertyRecommendations::dispatch($property);

        return response()->json($property, 201);
    }

    // Retrieve a specific property
    public function show($id)
    {
        $property = Property::with('recommendations')->findOrFail($id);
        return response()->json($property);
    }
}