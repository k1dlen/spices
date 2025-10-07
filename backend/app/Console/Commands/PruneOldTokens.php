<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Laravel\Sanctum\PersonalAccessToken;

class PruneOldTokens extends Command
{
    protected $signature = 'tokens:prune-old';
    protected $description = 'Удаляет Sanctum-токены старше 30 дней';

    public function handle()
    {
        $cutoff = Carbon::now()->subDays(30);

        $deleted = PersonalAccessToken::where('expires_at', '<', now())
            ->orWhere(function ($query) use ($cutoff) {
                $query->whereNull('expires_at')
                    ->where('created_at', '<', $cutoff);
            })
            ->delete();

        $this->info("Удалено {$deleted} старых токенов.");
    }
}
