<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Commande;
use App\Models\DetailCommande;
use App\Models\ProduitEnStock;
use App\Models\Paiement; 
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class CommandeController extends Controller
{
    // Lister toutes les commandes
    public function index()
    {
        $commandes = Commande::with(['client', 'produit','details.produit'])->orderBy('created_at', 'desc')->get();
        return response()->json($commandes);
    }


    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'produits' => 'required|array',
            'produits.*.produit_id' => 'required|exists:produits,id',
            'produits.*.quantite' => 'required|integer|min:1',
            'produits.*.prix' => 'required|numeric',
            'methode_paiement' => 'required|string', // Validation de la méthode de paiement
            'total_a_payer' => 'required|numeric', // Validation du total à payer
        ]);
    
        DB::beginTransaction();
        try {
            $commande = Commande::create([
                'client_id' => $request->client_id,
                'etat' => 'en attente', // ou tout autre état initial
            ]);
    
            foreach ($request->produits as $produit) {
                DetailCommande::create([
                    'commande_id' => $commande->id,
                    'produit_id' => $produit['produit_id'],
                    'quantite' => $produit['quantite'],
                    'prix' => $produit['prix'],
                ]);
    
                $produitEnStock = ProduitEnStock::where('produit_id', $produit['produit_id'])->first();
                if (!$produitEnStock || $produitEnStock->quantite_actuelle < $produit['quantite']) {
                    throw new \Exception("Quantité en stock insuffisante pour le produit ID: {$produit['produit_id']}");
                }
                $produitEnStock->decrement('quantite_actuelle', $produit['quantite']);
            }
    
            // Enregistrement des détails du paiement
            Paiement::create([
                'commande_id' => $commande->id,
                'methode' => $request->methode_paiement,
                'total' => $request->total_a_payer,
            ]);
    
            DB::commit();
            // Retourne la commande créée avec un message de succès
            return response()->json(['success' => true, 'message' => 'Commande créée avec succès', 'data' => $commande], 201);
        } catch (\Exception $e) {
            DB::rollback();
            // Retourne un message d'erreur si la création a échoué
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
        
    }
    


    // Afficher une commande spécifique
    public function show($id)
    {
        try {
            $commande = Commande::with(['client', 'produit'])->findOrFail($id);
            return response()->json($commande);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Commande non trouvée'], 404);
        }
    }

    // Mettre à jour une commande
    public function update(Request $request, $id)
    {
        // La mise à jour des commandes peut être complexe en fonction des règles métier.
        // Par exemple, vérifier si la commande n'est pas déjà expédiée, etc.
        // Implémentez ici la logique de mise à jour selon vos besoins.
    }


    public function updateEtat(Request $request, $id)
    {
        $commande = Commande::findOrFail($id); // Trouve la commande ou échoue avec une 404
        
        $validated = $request->validate([
            'etat' => 'required|string', // Validation simple, ajustez selon vos besoins
        ]);
        
        $commande->etat = $validated['etat'];
        $commande->save(); // Sauvegarde les changements dans la base de données
        
        return response()->json($commande);
    }

    // Supprimer une commande
    public function destroy($id)
    {
        try {
            $commande = Commande::findOrFail($id);
            $commande->delete();
            return response()->json(['message' => 'Commande supprimée avec succès']);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Commande non trouvée'], 404);
        }
    }
}
