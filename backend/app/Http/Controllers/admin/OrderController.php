<?php

namespace App\Http\Controllers\admin;

use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::orderBy('created_at', 'ASC')
            ->paginate(10);

        return response()->json([
            'data' => $orders->items(),
            'status' => 200,
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'total' => $orders->total()
            ]
        ], 200);
    }

    public function show($id)
    {
        $order = Order::with('items', 'items.product')->find($id);

        if ($order == null) {
            return response()->json([
                'message' => 'Заказ не найден',
                'status' => 404
            ], 404);
        }

        return response()->json([
            'data' => $order,
            'status' => 200
        ], 200);
    }

    public function update($id, Request $request)
    {
        $order = Order::find($id);

        if ($order == null) {
            return response()->json([
                'message' => 'Заказ не найден',
                'status' => 404
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:pending,shipped,delivered,cancelled',
            'payment_status' => 'required|in:paid,not_paid',
            'cancellation_reason' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $order->status = $request->status;
        $order->payment_status = $request->payment_status;
        $order->cancellation_reason = $request->cancellation_reason ?? null;
        $order->save();

        return response()->json([
            'data' => $order,
            'status' => 200,
            'message' => 'Заказ был успешно обновлен'
        ], 200);
    }
}
