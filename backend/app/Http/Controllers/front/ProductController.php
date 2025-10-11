<?php

namespace App\Http\Controllers\front;

use App\Models\Product;
use App\Models\Category;
use App\Models\Subcategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ProductController extends Controller
{
    public function getProducts(Request $request)
    {
        $query = Product::where('is_active', 1)->orderBy('created_at', 'DESC');

        if ($request->has('subcategory')) {
            $subcategories = array_filter(explode(',', $request->query('subcategory')), 'is_numeric');
            $query->whereIn('subcategory_id', $subcategories);
        }

        $products = $query->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);
    }

    public function getCategories()
    {
        $categories = Category::orderBy('id', 'ASC')->where('is_active', 1)->get();

        return response()->json([
            'status' => 200,
            'data' => $categories
        ], 200);
    }

    public function getSubcategories()
    {
        $subcategories = Subcategory::orderBy('id', 'ASC')->get();

        return response()->json([
            'status' => 200,
            'data' => $subcategories
        ]);
    }

    public function getProduct($id)
    {
        $product = Product::with('product_images')->find($id);

        return response()->json([
            'status' => 200,
            'data' => $product
        ], 200);
    }

    public function getRandomProducts($currentProductId)
    {
        $randomProducts = Product::where('is_active', true)
            ->where('id', '!=', $currentProductId)
            ->inRandomOrder()
            ->take(4)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $randomProducts
        ], 200);
    }

    public function getOurCollection()
    {
        $products = Product::where('is_active', true)
            ->where('status', '!=', 'sold_out')
            ->where('is_featured', true)
            ->orderBy('created_at', 'DESC')
            ->select('id', 'name', 'short_description', 'image')
            ->limit(3)
            ->get();

        return response()->json([
            'status' => 200,
            'data' => $products
        ], 200);
    }
}
