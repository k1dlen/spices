<?php

namespace App\Http\Controllers\front;

use App\Models\Product;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    public function index()
    {
        $cart = CartItem::with('product')
            ->where('user_id', auth('sanctum')->id())
            ->get();
        return response()->json([
            'status' => 200,
            'data' => $cart
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => [
                'required',
                Rule::exists('products', 'id')
                    ->where('is_active', true)
                    ->where('status', '!=', 'sold_out'),
            ],
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        $cartItem = CartItem::firstOrCreate([
            'user_id' => auth('sanctum')->id(),
            'product_id' => $request->product_id,
        ], ['quantity' => 0]);

        $availableToAdd = max(0, $product->reserve - $cartItem->quantity);
        $incrementBy = min($request->quantity, $availableToAdd);

        if ($incrementBy > 0) {
            $cartItem->increment('quantity', $incrementBy);
            $cartItem->refresh();
        }
        $cartItem->load('product');

        return response()->json([
            'status' => 200,
            'data' => $cartItem,
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate(['quantity' => 'required|integer|min:1']);

        $cartItem = CartItem::where('user_id', auth('sanctum')->id())->where('id', $id)->firstOrFail();

        $product = Product::where('id', $cartItem->product_id)
            ->where('is_active', true)
            ->where('status', '!=', 'sold_out')
            ->firstOrFail();

        $newQuantity = $request->quantity;

        $cartItem->quantity = min($newQuantity, $product->reserve);
        $cartItem->save();

        $cartItem->load('product');
        return response()->json([
            'status' => 200,
            'data' => $cartItem,
        ], 200);
    }

    public function destroy($id)
    {
        $cartItem = CartItem::where('user_id', auth('sanctum')->id())->where('id', $id)->firstOrFail();
        $cartItem->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Товар удален из корзины'
        ], 200);
    }
}
