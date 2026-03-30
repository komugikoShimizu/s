<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MonthlyBudget extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'target_month',
        'budget_amount',
        'alert_threshold',
    ];

    protected $casts = [
        'user_id' => 'integer',
        'category_id' => 'integer',
        'target_month' => 'date',
        'budget_amount' => 'integer',
        'alert_threshold' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
}
