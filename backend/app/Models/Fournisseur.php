<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    use HasFactory;
    protected $fillable = ['nom', 'adresse', 'telephone', 'email'];

    // Dans le modèle Fournisseur
    public function produits()
    {
        return $this->hasMany(Produit::class);
    }

}
