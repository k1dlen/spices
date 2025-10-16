<?php

namespace App\Models;

use App\Models\User;
use App\Models\OrderItem;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{

    protected $fillable = [
        'user_id',
        'name',
        'surname',
        'email',
        'address',
        'mobile',
        'grand_total',
        'subtotal',
        'discount',
        'shipping',
        'payment_method',
        'status'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    protected function casts(): array
    {
        return [
            'created_at' => 'datetime:d M, Y',
        ];
    }
}
