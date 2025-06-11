<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MouvementStock;
use App\Models\ProduitEnStock;

class MouvementStockController extends Controller
{
    // Lister tous les mouvements de stock
    public function index()
{
    // Remplacez 'produitEnStock.produit' par la relation appropriée dans votre modèle MouvementStock
    // pour accéder au produit associé au produit en stock.
    $mouvements = MouvementStock::with(['produitEnStock.produit', 'entrepot'])->get();

    // Transformez les données si nécessaire pour inclure les informations du produit directement
    // dans chaque mouvement de stock.
    $mouvementsTransformed = $mouvements->map(function ($mouvement) {
        $mouvement->nomProduit = $mouvement->produitEnStock->produit->nom; // Assurez-vous que cette chaîne de relations existe.
        $mouvement->quantiteActuelleProduit = $mouvement->produitEnStock->quantite_actuelle;
        return $mouvement;
    });

    return response()->json($mouvementsTransformed);
}

    

    /*
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'produit_id' => 'required|exists:produits_en_stock,id', // Assurez-vous que ceci correspond à votre table et colonne correctes
            'type_mouvement' => 'required|in:entrée,sortie,transfert,ajustement',
            'quantite' => 'required|integer',
            'date' => 'required|date',
            'entrepot_id' => 'required|exists:entrepots,id'
        ]);

        $mouvementStock = MouvementStock::create($validatedData);
        return response()->json($mouvementStock, 201);
    } */


    // Créer un nouveau mouvement de stock
public function store(Request $request)
{
    $validatedData = $request->validate([
        'produit_id' => 'required|exists:produits_en_stock,id',
        'type_mouvement' => 'required|in:entrée,sortie,transfert,ajustement',
        'quantite' => 'required|integer',
        'date' => 'required|date',
        'entrepot_id' => 'required|exists:entrepots,id'
    ]);

    $mouvementStock = MouvementStock::create($validatedData);

    // Mise à jour de la quantité actuelle du produit en stock
    $produitEnStock = ProduitEnStock::findOrFail($validatedData['produit_id']);
    if ($validatedData['type_mouvement'] === 'entrée') {
        $produitEnStock->increment('quantite_actuelle', $validatedData['quantite']);
    } elseif ($validatedData['type_mouvement'] === 'sortie') {
        $produitEnStock->decrement('quantite_actuelle', $validatedData['quantite']);
    }

    return response()->json($mouvementStock, 201);
}




    // Afficher un mouvement de stock spécifique
    public function show($id)
    {
        return MouvementStock::with(['produitEnStock', 'entrepot'])->findOrFail($id);
    }

    // Mettre à jour un mouvement de stock
    public function update(Request $request, $id)
    {
        $mouvementStock = MouvementStock::findOrFail($id);

        $validatedData = $request->validate([
            'produit_id' => 'required|exists:produits_en_stock,id',
            'type_mouvement' => 'required|in:entrée,sortie,transfert,ajustement',
            'quantite' => 'required|integer',
            'date' => 'required|date',
            'entrepot_id' => 'required|exists:entrepots,id'
        ]);

        $mouvementStock->update($validatedData);
        return response()->json($mouvementStock, 200);
    }

    // Supprimer un mouvement de stock
    public function destroy($id)
    {
        MouvementStock::destroy($id);
        return response()->json(null, 204);
    }
}
