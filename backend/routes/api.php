<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\admin\SubcategoryController;
use App\Models\Product;

Route::post('admin/login', [AuthController::class, 'authenticate'])->middleware('throttle:5,1');
Route::post('login', [AccountController::class, 'authenticate'])->middleware('throttle:5,1');
Route::post('register', [AccountController::class, 'register'])->middleware('throttle:5,1');


Route::group(['middleware' => ['auth:sanctum', 'checkUserRole']], function () {
    Route::post('logout', [AccountController::class, 'logout']);
});


Route::group(['middleware' => ['auth:sanctum', 'checkAdminRole']], function () {
    Route::resource('categories', CategoryController::class);
    Route::resource('subcategories', SubcategoryController::class);
    Route::get('subcategories/category/{id}', [SubcategoryController::class, 'indexByCategory']);
    Route::resource('products', ProductController::class);
    Route::post('temp-images', [TempImageController::class, 'store'])->middleware('throttle:10,1');
    Route::delete('temp-images/{id}', [TempImageController::class, 'destroy']);
    Route::delete('product-images/{id}', [ProductController::class, 'deleteProductImage']);
    Route::post('logout', [AuthController::class, 'logout']);
});
