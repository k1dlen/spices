<?php

namespace App\Http\Controllers\admin;

use App\Models\Product;
use App\Models\TempImage;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        $product = Product::orderBy('created_at', 'DESC')->with(['product_images'])->get();
        return response()->json([
            'status' => 200,
            'data' => $product
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'subcategory_id' => 'required|integer|exists:subcategories,id',
            'grams' => 'nullable|integer|min:0',
            'discount' => 'nullable|integer|min:0|max:100',
            'reserve' => 'nullable|integer|min:0',
            'status' => 'nullable|in:in_stock,sold_out,on_sale',
            'is_active' => 'nullable|boolean',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string',
            'gallery' => 'nullable|array',
            'gallery.*' => 'integer|exists:temp_images,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $product = new Product();
        $product->name = $request->name;
        $product->price = $request->price;
        $product->discount = $request->discount ?? 0;
        $product->subcategory_id = $request->subcategory_id;
        $product->grams = $request->grams;
        $product->reserve = $request->reserve ?? 0;
        $product->status = $request->status ?? 'in_stock';
        $product->is_active = $request->is_active ?? true;
        $product->description = $request->description;
        $product->short_description = $request->short_description;
        $product->save();

        if (!empty($request->gallery)) {
            foreach ($request->gallery as $index => $tempImageId) {
                $tempImage = TempImage::find($tempImageId);
                if (!$tempImage) continue;

                $imageName = $product->id . '-' . time() . '-' . $index . '.' . pathinfo($tempImage->name, PATHINFO_EXTENSION);
                rename(public_path('uploads/temp/' . $tempImage->name), public_path('uploads/products/' . $imageName));

                $productImage = new ProductImage();
                $productImage->product_id = $product->id;
                $productImage->image = $imageName;
                $productImage->save();

                if ($index === 0) {
                    $product->image = $imageName;
                    $product->save();
                }

                $tempImage->delete();
            }
        }

        return response()->json([
            'status' => 200,
            'message' => 'Товар успешно создан',
            'product_id' => $product->id
        ]);
    }

    public function show($id)
    {
        $product = Product::with(['product_images', 'subcategory.category'])->find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Товар не найден'
            ], 404);
        }


        return response()->json([
            'status' => 200,
            'data' => $product
        ], 200);
    }

    public function update(Request $request, $id)
    {

        $product = Product::find($id);

        if ($product == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Товар не найден'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'subcategory_id' => 'required|integer|exists:subcategories,id',
            'grams' => 'nullable|integer|min:0',
            'discount' => 'nullable|integer|min:0|max:100',
            'reserve' => 'nullable|integer|min:0',
            'status' => 'nullable|in:in_stock,sold_out,on_sale',
            'is_active' => 'nullable|boolean',
            'description' => 'nullable|string',
            'short_description' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'errors' => $validator->errors()
            ], 400);
        }

        $imagesIds = $request->input('product_images_ids', []);
        $deletedImages = ProductImage::where('product_id', $id)
            ->whereNotIn('id', $imagesIds)
            ->get();

        $wasDefaultDeleted = $deletedImages->contains('image', $product->image);

        ProductImage::where('product_id', $id)
            ->whereNotIn('id', $imagesIds)
            ->delete();

        $newDefaultImage = null;

        if ($request->filled('default_image_id')) {
            $defaultId = $request->input('default_image_id');

            $existingImage = ProductImage::where('product_id', $id)
                ->where('id', $defaultId)
                ->first();

            if ($existingImage) {
                $newDefaultImage = $existingImage->image;
            } else {
                $tempImage = TempImage::find($defaultId);
                if ($tempImage) {
                    $ext = pathinfo($tempImage->name, PATHINFO_EXTENSION);
                    $newName = $product->id . '-' . time() . '.' . $ext;

                    rename(
                        public_path("uploads/temp/{$tempImage->name}"),
                        public_path("uploads/products/{$newName}")
                    );

                    $productImage = new ProductImage();
                    $productImage->product_id = $product->id;
                    $productImage->image = $newName;
                    $productImage->save();

                    $newDefaultImage = $newName;
                    $tempImage->delete();
                }
            }

            if ($newDefaultImage) {
                $product->image = $newDefaultImage;
            }
        }


        if ($request->has('temp_image_ids')) {
            $tempImageIds = $request->temp_image_ids;
            foreach ($tempImageIds as $index => $tempImageId) {

                if ($tempImageId == $request->input('default_image_id')) continue;

                $tempImage = TempImage::find($tempImageId);
                if (!$tempImage) continue;

                $extension = pathinfo($tempImage->name, PATHINFO_EXTENSION);
                $newName = $product->id . '-' . time() . '-' . $index . '.' . $extension;

                $source = public_path("uploads/temp/{$tempImage->name}");
                $destination = public_path("uploads/products/{$newName}");

                if (file_exists($source)) {
                    rename($source, $destination);
                }

                $productImage = new ProductImage();
                $productImage->product_id = $product->id;
                $productImage->image = $newName;
                $productImage->save();

                $tempImage->delete();
            }
        }

        $product->name = $request->name;
        $product->price = $request->price;
        $product->discount = $request->discount ?? 0;
        $product->subcategory_id = $request->subcategory_id;
        $product->grams = $request->grams;
        $product->reserve = $request->reserve ?? 0;
        $product->status = $request->status ?? 'in_stock';
        $product->is_active = $request->is_active ?? true;
        $product->description = $request->description;
        $product->short_description = $request->short_description;

        $remainingImages = ProductImage::where('product_id', $product->id)
            ->pluck('image')
            ->toArray();

        if (empty($remainingImages)) {
            $product->image = null;
        } else {
            if (!$request->filled('default_image_id')) {
                $product->image = $remainingImages[0];
            } else {
                if (!in_array($product->image, $remainingImages)) {
                    $product->image = $remainingImages[0];
                }
            }
        }

        $product->save();

        return response()->json([
            'status' => 200,
            'message' => 'Товар был успешно обновлен'
        ], 200);
    }


    public function destroy($id)
    {

        $product = Product::with('product_images')->find($id);

        if (!$product) {
            return response()->json([
                'status' => 404,
                'message' => 'Товар не найден'
            ], 404);
        }

        if ($product->product_images && $product->product_images->count() > 0) {
            foreach ($product->product_images as $image) {
                $imagePath = public_path('uploads/products/' . $image->image);

                if (File::exists($imagePath)) {
                    File::delete($imagePath);
                }
            }
        }

        if ($product->image) {
            $mainImagePath = public_path('uploads/products/' . $product->image);
            if (File::exists($mainImagePath)) {
                File::delete($mainImagePath);
            }
        }

        $product->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Товар успешно удалён'
        ], 200);
    }

    public function deleteProductImage($id)
    {
        $productImage = ProductImage::find($id);

        if ($productImage == null) {
            return response()->json([
                'status' => 404,
                'message' => 'Image not found'
            ], 404);
        }

        $filePath = public_path('uploads/products/' . $productImage->image);
        if (File::exists($filePath)) {
            File::delete($filePath);
        }

        $productImage->delete();

        return response()->json([
            'status' => 200,
            'message' => 'Изображение удалено'
        ]);
    }
}
