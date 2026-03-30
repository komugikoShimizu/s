<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class LedgerEntry extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'account_id',
        'category_id',
        'entry_type',
        'entry_date',
        'amount',
        'title',
        'description',
        'memo',
        'source_type',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'account_id' => 'integer',
        'category_id' => 'integer',
        'entry_type' => 'string',
        'entry_date' => 'date',
        'amount' => 'integer',
        'title' => 'string',
        'description' => 'string',
        'memo' => 'string',
        'source_type' => 'string',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(Account::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
