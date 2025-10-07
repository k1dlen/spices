<?php

namespace App\Http\Controllers\front;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AccountController extends Controller
{

    public function register(Request $request)
    {
        $rules = [
            'name' => 'required',
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

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => "Выход из аккаунта успешно выполнен!"]);
    }
}
