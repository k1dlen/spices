<?php

namespace App\Http\Controllers\admin;

use App\Models\TempImage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;

class TempImageController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $image = $request->file('image');
        $imageName = time() . '.' . $image->extension();
        $image->move(public_path('uploads/temp'), $imageName);

        $tempImage = new TempImage();
        $tempImage->name = $imageName;
        $tempImage->save();

        return response()->json([
            'status' => 200,
            'message' => 'Фотогравия была успешно загружена',
            'data' => $tempImage
        ]);
    }


    public function destroy($id)
    {
        $tempImage = TempImage::find($id);

        if (!$tempImage) {
            return response()->json([
                'status' => 404,
                'message' => 'Изображение не найдено'
            ], 404);
        }

        $filePath = public_path('uploads/temp/' . $tempImage->name);
        if (File::exists($filePath)) {
            File::delete($filePath);
        }

        $tempImage->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Изображение удалено'
        ]);
    }
}
