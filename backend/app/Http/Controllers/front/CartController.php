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
        $user = Auth::user();
        $cart = CartItem::with('product')->where('user_id', $user->id)->get();
        return response()->json(['status' => 200, 'data' => $cart]);
    }

    public function store(Request $request)
    {
        $user = Auth::user();
        $request->validate([
            'product_id' => [
                'required',
                Rule::exists('products', 'id')
                    ->where('is_active', true)
                    ->where('status', 'in_stock'),
            ],
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);

        $cartItem = CartItem::firstOrCreate([
            'user_id' => $user->id,
            'product_id' => $request->product_id,
        ], ['quantity' => 0]);

        $availableToAdd = max(0, $product->reserve - $cartItem->quantity);
        $incrementBy = min($request->quantity, $availableToAdd);

        if ($incrementBy > 0) {
            $cartItem->increment('quantity', $incrementBy);
            $cartItem->refresh();
        }

        return response()->json([
            'status' => 200,
            'data' => $cartItem,
            'can_add_more' => $cartItem->quantity < $product->reserve,
            'max_available' => $product->reserve - $cartItem->quantity
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = Auth::user();

        $request->validate(['quantity' => 'required|integer|min:1']);

        $cartItem = CartItem::where('user_id', $user->id)->where('id', $id)->firstOrFail();



        $product = Product::findOrFail($cartItem->product_id);

        $newQuantity = $request->quantity;

        $cartItem->quantity = min($newQuantity, $product->reserve);
        $cartItem->save();

        return response()->json([
            'status' => 200,
            'data' => $cartItem,
            'can_add_more' => $cartItem->quantity < $product->reserve,
            'max_available' => $product->reserve - $cartItem->quantity
        ]);
    }

    public function destroy($id)
    {
        $user = Auth::user();
        $cartItem = CartItem::where('user_id', $user->id)->where('id', $id)->firstOrFail();
        $cartItem->delete();

        return response()->json(['status' => 200, 'message' => 'Item removed']);
    }
}
