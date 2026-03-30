<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Account extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'name',
        'account_type',
        'initial_balance',
        'current_balance',
        'currency',
        'is_active',
        'sort_order',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'name' => 'string',
        'account_type' => 'string',
        'initial_balance' => 'integer',
        'current_balance' => 'integer',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function ledgerEntries(): HasMany
    {
        return $this->hasMany(LedgerEntry::class);
    }
}
