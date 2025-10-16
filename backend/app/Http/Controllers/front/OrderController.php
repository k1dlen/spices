<?php

namespace App\Http\Controllers\front;

use App\Models\Order;
use App\Models\CartItem;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'nullable|string|max:255',
            'email' => 'required|email',
            'address' => 'required|string',
            'mobile' => 'required|string|max:20',
            'payment_method' => 'required|in:cash_on_place,card_on_place',
        ]);

        $cartItems = CartItem::with('product')
            ->where('user_id', $request->user()->id)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json([
                'status' => 400,
                'message' => 'Ваша корзина пуста'
            ], 400);
        }

        $subtotal = $cartItems->sum(fn($item) => $item->quantity * $item->product->price);
        $discount = $cartItems->sum(fn($item) => ($item->product->discount / 100) * $item->product->price * $item->quantity);
        $shipping = $subtotal >= 1000 ? 0 : 200;
        $grandTotal = $subtotal - $discount + $shipping;

        $order = Order::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'surname' => $request->surname,
            'email' => $request->email,
            'address' => $request->address,
            'mobile' => $request->mobile,
            'grand_total' => $grandTotal,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'shipping' => $shipping,
            'payment_method' => $request->payment_method,
            'status' => 'pending',
            'payment_status' => 'not_paid',
        ]);

        foreach ($cartItems as $item) {
            $orderItem = new OrderItem();
            $orderItem->order_id = $order->id;
            $orderItem->total_price = $item['quantity'] * $item['product']['price'];
            $orderItem->unit_price = $item['product']['price'];
            $orderItem->quantity = $item['quantity'];
            $orderItem->product_id = $item['product_id'];
            $orderItem->product_name = $item['product']['name'];
            $orderItem->discount_percent = $item['product']['discount'];
            $orderItem->discount_amount = (($item['product']['discount'] * $item['product']['price']) * $item['quantity']) / 100;
            $orderItem->save();
        }

        CartItem::where('user_id', $request->user()->id)->delete();

        return response()->json([
            'status' => 200,
            'id' => $order->id,
            'message' => 'Ваш заказ успешно создан',
        ], 200);
    }
}
