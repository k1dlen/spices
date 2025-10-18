<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\admin\SubcategoryController;
use App\Http\Controllers\admin\OrderController as AdminOrderController;
use App\Http\Controllers\front\OrderController as FrontOrderController;
use App\Http\Controllers\front\CartController;
use App\Http\Controllers\front\ProductController as FrontProductController;


Route::post('admin/login', [AuthController::class, 'authenticate'])->middleware('throttle:5,1');
Route::post('login', [AccountController::class, 'authenticate'])->middleware('throttle:5,1');
Route::post('register', [AccountController::class, 'register'])->middleware('throttle:5,1');
Route::get('get-products', [FrontProductController::class, 'getProducts']);
Route::get('get-subcategories', [FrontProductController::class, 'getSubcategories']);
Route::get('get-categories', [FrontProductController::class, 'getCategories']);
Route::get('get-product/{id}', [FrontProductController::class, 'getProduct']);
Route::get('get-random-products/{currentProductId}', [FrontProductController::class, 'getRandomProducts']);
Route::get('get-our-collection', [FrontProductController::class, 'getOurCollection']);


Route::group(['middleware' => ['auth:sanctum', 'checkUserRole']], function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/orders', [FrontOrderController::class, 'store'])->middleware('throttle:5,1');
    Route::get('/getUserDetail', [AccountController::class, 'getUserDetail']);
    Route::put('update-user',  [AccountController::class, 'update'])->middleware('throttle:5,1');
    Route::resource('cart', CartController::class);
    Route::post('logout', [AccountController::class, 'logout']);
});


Route::group(['middleware' => ['auth:sanctum', 'checkAdminRole']], function () {
    Route::get('/admin', function (Request $request) {
        return $request->user();
    });
    Route::resource('categories', CategoryController::class);
    Route::resource('subcategories', SubcategoryController::class);
    Route::get('subcategories/category/{id}', [SubcategoryController::class, 'indexByCategory']);
    Route::resource('products', ProductController::class);
    Route::post('temp-images', [TempImageController::class, 'store'])->middleware('throttle:10,1');
    Route::delete('temp-images/{id}', [TempImageController::class, 'destroy']);
    Route::delete('product-images/{id}', [ProductController::class, 'deleteProductImage']);
    Route::post('logout', [AuthController::class, 'logout']);

    Route::get('orders', [AdminOrderController::class, 'index']);
    Route::get('orders/{id}', [AdminOrderController::class, 'show']);
    Route::put('orders/{id}', [AdminOrderController::class, 'update']);
});
