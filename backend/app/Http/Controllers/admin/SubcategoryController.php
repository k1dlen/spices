<?php

namespace App\Http\Controllers\admin;

use App\Models\Subcategory;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;

class SubcategoryController extends Controller
{
    public function indexByCategory($id)
    {
        $subcategories = Subcategory::where('category_id', $id)->get();

        return response()->json([
            'status' => 200,
            'data' => $subcategories
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'is_active' => 'required',
            'category_id' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => 400, 'errors' => $validator->errors()], 400);
        }

        $subcategory = new Subcategory();
        $subcategory->name = $request->name;
        $subcategory->is_active = $request->is_active;
        $subcategory->category_id = $request->category_id;
        $subcategory->save();
        return response()->json(['status' => 200, 'message' => 'Категория успешно создана', 'data' => $subcategory], 200);
    }


    public function destroy($id)
    {

        $subcategory = Subcategory::find($id);

        if ($subcategory == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Категория не найдена',
                'data' => []
            ], 404);
        }

        $subcategory->delete();

        return response()->json(['status' => 200, 'message' => 'Категория успешно удалена'], 200);
    }
}
