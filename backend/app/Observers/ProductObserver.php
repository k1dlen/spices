<?php

namespace App\Observers;

use App\Models\Product;

class ProductObserver
{

    public function saving(Product $product)
    {
        if ($product->discount > 0) {
            $product->status = 'on_sale';
        } elseif ($product->reserve == 0) {
            $product->status = 'sold_out';
        } else {
            $product->status = 'in_stock';
        }
    }

    /**
     * Handle the Product "created" event.
     */
    public function created(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "updated" event.
     */
    public function updated(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "deleted" event.
     */
    public function deleted(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "restored" event.
     */
    public function restored(Product $product): void
    {
        //
    }

    /**
     * Handle the Product "force deleted" event.
     */
    public function forceDeleted(Product $product): void
    {
        //
    }
}
