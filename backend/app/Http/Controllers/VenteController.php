<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\DetailCommande;
use DB;

class VenteController extends Controller
{
    public function index(Request $request)
    {
        $query = Commande::with(['details.produit', 'client', 'paiement']);
    
        if ($request->has('methodePaiement') && $request->methodePaiement != '') {
            $query->whereHas('paiement', function ($q) use ($request) {
                $q->where('methode', $request->methodePaiement);
            });
        }
    
        $ventes = $query->orderBy('created_at', 'desc')->get();
        return response()->json($ventes);
    }
    

    
    // Méthode pour obtenir les ventes sur une période donnée (optionnel)
    public function parPeriode(Request $request)
    {
        $debut = $request->debut; // Récupérer la date de début de la requête
        $fin = $request->fin; // Récupérer la date de fin de la requête
    
        $ventes = Commande::with(['details.produit', 'client', 'paiement'])
                        ->whereBetween('created_at', [$debut, $fin])
                        ->get();
    
        return response()->json($ventes);
    }
    
}
