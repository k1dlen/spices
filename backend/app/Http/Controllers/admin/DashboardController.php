<?php

namespace App\Http\Controllers\admin;

use Carbon\Carbon;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\OrderItem;

class DashboardController extends Controller
{
    public function index()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();

        $ordersCount = Order::whereBetween('created_at', [$startOfMonth, $now])->count();

        $newUsersCount = User::whereBetween('created_at', [$startOfMonth, $now])->count();

        $orderIds = Order::whereBetween('created_at', [$startOfMonth, $now])->pluck('id');

        if ($orderIds->isEmpty()) {
            $topProduct = null;
        } else {
            $topProductData = OrderItem::whereIn('order_id', $orderIds)
                ->select('product_id', 'product_name', 'quantity')
                ->get()
                ->groupBy('product_id')
                ->map(function ($items, $productId) {
                    return [
                        'product_id' => $productId,
                        'product_name' => $items->first()->product_name,
                        'total_sold' => $items->sum('quantity'),
                    ];
                })
                ->sortByDesc('total_sold')
                ->values()
                ->first();

            $topProduct = $topProductData ? [
                'id' => $topProductData['product_id'],
                'name' => $topProductData['product_name'],
                'sold_count' => $topProductData['total_sold']
            ] : null;
        }

        return response()->json([
            'status' => 200,
            'top_product' => $topProduct,
            'new_users_count' => $newUsersCount,
            'orders_count' => $ordersCount,
        ], 200);
    }
}
