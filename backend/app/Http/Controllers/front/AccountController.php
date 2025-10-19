<?php

namespace App\Http\Controllers\front;

use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AccountController extends Controller
{

    public function register(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:50',
            'surname' => 'nullable|string|max:50',
            'email' => 'required|email|unique:users',
            'password' => ['required', 'confirmed', Password::min(12)->mixedCase()->numbers()->symbols()->uncompromised()]
        ];


        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $user = new User();
        $user->name = $request->name;
        $user->surname = $request->surname;
        $user->email = $request->email;
        $user->password = Hash::make($request->password);
        $user->role = 'customer';
        $user->save();
        return response()->json([
            'status' => 200,
            'message' => 'Вы успешно зарегестрировались'
        ], 200);
    }

    public function authenticate(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 400, 'errors' => $validator->errors()], 400);
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {

            $user = User::find(Auth::user()->id);

            $token = $user->createToken(
                'web',
                [],
                now()->addDays(30)
            )->plainTextToken;

            return response()->json([
                'status' => 200,
                'token' => $token,
                'id' => $user->id,
                'name' => $user->name
            ], 200);
        } else {
            return response()->json([
                'status' => 401,
                'message' => 'Либо адрес эл.почты, либо пароль неверен'
            ], 401);
        }
    }

    public function getUserDetail(Request $request)
    {
        $user = User::find($request->user()->id);

        if ($user == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Пользователь не найден'
            ], 404);
        } else {
            return response()->json([
                'status' => 200,
                'data' => $user
            ], 200);
        }
    }

    public function getUserOrders(Request $request)
    {
        $user = User::find($request->user()->id);

        if ($user == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Пользователь не найден'
            ], 404);
        }

        $orders = Order::where('user_id', $request->user()->id)->paginate(10);

        if ($orders == null) {
            return response()->json([
                'status' => 404,
                'message' => 'У данного пользователя не было найдено заказов'
            ], 404);
        }

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


    public function getOrderDetail($id, Request $request)
    {

        $order = Order::where([
            'user_id' => $request->user()->id,
            'id' => $id
        ])->with('items', 'items.product')
            ->first();

        if ($order == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Заказ не найден'
            ], 404);
        }

        return response()->json([
            'data' => $order,
            'status' => 200,
        ], 200);
    }

    public function update(Request $request)
    {
        $user = User::find($request->user()->id);

        if ($user == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Пользователь не найден'
            ], 404);
        }



        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:50',
            'surname' => 'nullable|string|max:50',
            'email' => [
                'required',
                'email',
                Rule::unique('users')->ignore($user->id),
            ],
            'address' => 'nullable|string|max:255',
            'mobile' => 'nullable|string|max:20'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $input = $validator->validated();

        $normalize = fn($value) => $value ?? '';

        $current = [
            'name' => $normalize($user->name),
            'surname' => $normalize($user->surname),
            'email' => $normalize($user->email),
            'address' => $normalize($user->address),
            'mobile' => $normalize($user->mobile),
        ];

        $incoming = [
            'name' => $normalize($input['name']),
            'surname' => $normalize($input['surname'] ?? null),
            'email' => $normalize($input['email']),
            'address' => $normalize($input['address'] ?? null),
            'mobile' => $normalize($input['mobile'] ?? null),
        ];

        if ($current === $incoming) {
            return response()->json([
                'data' => $user,
                'status' => 200,
                'message' => 'Данные не были изменены'
            ], 200);
        }

        $user->fill($incoming);
        $user->save();

        return response()->json([
            'data' => $user,
            'status' => 200,
            'message' => 'Данные о пользователе были успешно обновлены'
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => "Выход из аккаунта успешно выполнен!"]);
    }
}
