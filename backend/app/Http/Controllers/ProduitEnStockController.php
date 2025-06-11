<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use App\Models\ProduitEnStock;

class ProduitEnStockController extends Controller
{
    public function index()
    {
        $produitsEnStock = ProduitEnStock::with('produit')->get();
        return response()->json($produitsEnStock);
    }

    // Créer un nouveau produit en stock
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'description' => 'nullable|string',
            'prix_vente' => 'required|numeric',
            'quantite_initiale' => 'required|integer',
            'quantite_actuelle' => 'required|integer'
        ]);

        $produitEnStock = ProduitEnStock::create($validatedData);
        return response()->json($produitEnStock, 201);
    }

    // Afficher un seul produit en stock
    public function show($id)
    {
        return ProduitEnStock::findOrFail($id);
    }

    // Mettre à jour un produit en stock
    public function update(Request $request, $id)
    {
        $produitEnStock = ProduitEnStock::findOrFail($id);

        $validatedData = $request->validate([
            'produit_id' => 'required|exists:produits,id',
            'description' => 'nullable|string',
            'prix_vente' => 'required|numeric',
            'quantite_initiale' => 'sometimes|required|integer',
            'quantite_actuelle' => 'sometimes|required|integer'
        ]);

        $produitEnStock->update($validatedData);
        return response()->json($produitEnStock, 200);
    }

    // Supprimer un produit en stock
    public function destroy($id)
    {
        ProduitEnStock::destroy($id);
        return response()->json(null, 204);
    }
}
