<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TempImage;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Carbon;

class CleanupTempImages extends Command
{
    protected $signature = 'temp-images:cleanup';
    protected $description = 'Удаляет временные изображения старше 1 часа';

    public function handle()
    {
        $cutoff = Carbon::now()->subHour();

        $oldImages = TempImage::where('created_at', '<', $cutoff)->get();

        foreach ($oldImages as $image) {
            $filePath = public_path('uploads/temp/' . $image->name);

            if (File::exists($filePath)) {
                File::delete($filePath);
            }

            $image->delete();
        }

        $this->info('Удалено ' . $oldImages->count() . ' временных изображений.');
    }
}
