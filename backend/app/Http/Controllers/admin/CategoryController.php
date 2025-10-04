<?php

namespace App\Http\Controllers\admin;

use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{

    public function index()
    {
        $categories = Category::orderBy('id', 'ASC')->get();

        return response()->json([
            'status' => 200,
            'data' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'is_active' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 400, 'errors' => $validator->errors()], 400);
        }

        $category = new Category();
        $category->name = $request->name;
        $category->is_active = $request->is_active;
        $category->save();
        return response()->json(['status' => 200, 'message' => 'Категория успешно создана', 'data' => $category], 200);
    }


    public function destroy($id)
    {

        $category = Category::find($id);

        if ($category == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Категория не найдена',
                'data' => []
            ], 404);
        }

        $category->delete();

        return response()->json(['status' => 200, 'message' => 'Категория успешно удалена'], 200);
    }
}
