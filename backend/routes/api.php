<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\admin\AuthController;
use App\Http\Controllers\front\AccountController;


Route::post('admin/login', [AuthController::class, 'authenticate']);
Route::post('login', [AccountController::class, 'authenticate']);
Route::post('register', [AccountController::class, 'register']);
