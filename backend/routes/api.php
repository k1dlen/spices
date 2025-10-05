<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\admin\ProductController;
use App\Http\Controllers\front\AccountController;
use App\Http\Controllers\admin\CategoryController;
use App\Http\Controllers\admin\TempImageController;
use App\Http\Controllers\admin\SubcategoryController;


Route::post('admin/login', [AuthController::class, 'authenticate']);
Route::post('login', [AccountController::class, 'authenticate']);
Route::post('register', [AccountController::class, 'register']);

Route::group(['middleware' => ['auth:sanctum', 'checkAdminRole']], function () {
    Route::resource('categories', CategoryController::class);
    Route::resource('subcategories', SubcategoryController::class);
    Route::get('subcategories/category/{id}', [SubcategoryController::class, 'indexByCategory']);
    Route::resource('products', ProductController::class);
    Route::post('temp-images', [TempImageController::class, 'store']);
    Route::delete('temp-images/{id}', [TempImageController::class, 'destroy']);
});
