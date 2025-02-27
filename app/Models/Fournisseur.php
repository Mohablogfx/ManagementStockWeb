<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    use HasFactory;
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'nom_complet',
        'telephone',
        'rc',
        'nom_societe',
        'ice',
        'dette',
    ];

    /**
     * Get the orders forms for the supplier.
     */
    public function bon_commandes()
    {
        return $this->hasMany(Bon_commande::class);
    }
}
