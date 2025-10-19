<?php

namespace App\Http\Controllers\admin;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('created_at', 'DESC')->paginate(10);

        return response()->json([
            'data' => $users->items(),
            'status' => 200,
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'total' => $users->total()
            ]
        ], 200);
    }

    public function show($id)
    {
        $user = User::find($id);

        if ($user == null) {
            return response()->json([
                'message' => 'Пользователь не найден',
                'status' => 404
            ], 404);
        }

        $lastOrder = $user->orders()
            ->latest('created_at')
            ->select('id', 'created_at')
            ->first();

        return response()->json([
            'data' => $user,
            'orders_count' => $user->orders()->count(),
            'last_order' => $lastOrder ? [
                'id' => $lastOrder->id,
                'created_at' => $lastOrder->created_at
            ] : null,
            'status' => 200,
        ], 200);
    }
}
