<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\VenteController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CommandeController;

use App\Http\Controllers\EntrepotController;
use App\Http\Controllers\CategorieController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\VenteRapportController;
use App\Http\Controllers\MouvementStockController;
use App\Http\Controllers\ProduitEnStockController;
use App\Http\Controllers\AjustementStockController;
use App\Http\Controllers\OuvertureCaisseController;
use App\Http\Controllers\StatistiqueController;

//use App\Http\Controllers\Auth\AuthController;
//use App\Http\Controllers\AuthController;

//Catégories---------------------------------------------------
Route::apiResource('categories', CategorieController::class);
Route::put('/categories/{id}', 'CategorieController@update');
Route::delete('/categories/{id}', 'CategorieController@destroy');
//--------------------------------------------------------------

//fournisseurs---------------------------------------------------
Route::apiResource('fournisseurs', FournisseurController::class);
Route::put('/fournisseurs/{id}', 'FournisseurController@update');
Route::delete('/fournisseurs/{id}', 'FournisseurController@destroy');
//--------------------------------------------------------------


//Clients------------------------------------------------------
Route::apiResource('clients', ClientController::class);
Route::put('/clients/{id}', [ClientController::class, 'update']);
Route::delete('/clients/{id}', [ClientController::class, 'destroy']);
//-------------------------------------------------------------


//Produits------------------------------------------------------
Route::apiResource('produits', ProduitController::class)->except(['update', 'destroy']);
Route::put('/produits/{id}', [ProduitController::class, 'update']);
Route::delete('/produits/{produit}', [ProduitController::class, 'destroy']);
//-------------------------------------------------------------


//produits_en_stock--------------------------------------------
Route::apiResource('produits_en_stock', ProduitEnStockController::class)->except(['update', 'destroy']);
Route::put('/produits_en_stock/{id}', [ProduitEnStockController::class, 'update']);
Route::delete('/produits_en_stock/{id}', [ProduitEnStockController::class, 'destroy']);
//-------------------------------------------------------------


// entrepots---------------------------------------------------
Route::apiResource('entrepots', EntrepotController::class)->except(['update', 'destroy']);
Route::put('/entrepots/{id}', [EntrepotController::class, 'update']);
Route::delete('/entrepots/{id}', [EntrepotController::class, 'destroy']);
//-------------------------------------------------------------


// mouvements_stock---------------------------------------------------
Route::apiResource('mouvements_stock', MouvementStockController::class)->except(['update', 'destroy']);
Route::put('/mouvements_stock/{id}', [MouvementStockController::class, 'update']);
Route::delete('/mouvements_stock/{id}', [MouvementStockController::class, 'destroy']);
//-------------------------------------------------------------


// ajustements_stock---------------------------------------------------
Route::apiResource('ajustements_stock', AjustementStockController::class)->except(['update', 'destroy']);
Route::put('/ajustements_stock/{id}', [AjustementStockController::class, 'update']);
Route::delete('/ajustements_stock/{id}', [AjustementStockController::class, 'destroy']);
//-------------------------------------------------------------


// Commandes---------------------------------------------------
Route::apiResource('commandes', CommandeController::class);
Route::put('/commandes/{commande}', [CommandeController::class, 'updateEtat']);
//-------------------------------------------------------------


Route::get('/ventes', [VenteController::class, 'index']);
Route::post('/ventes/periode', [VenteController::class, 'parPeriode']); // Pour filtrer par période



// Ouverture de caisse
Route::post('/ouvrir-caisse', [OuvertureCaisseController::class, 'ouvrirCaisse']);
Route::get('/ouvertures-caisse', [OuvertureCaisseController::class, 'listerOuvertures']);

Route::get('/rapports/ventes-par-produit', [VenteRapportController::class, 'rapportParProduit']);
Route::get('/rapports/ventes-par-client', [VenteRapportController::class, 'rapportParClient']);
Route::get('/rapports/tendances-produit-plus-vendu', [VenteRapportController::class, 'suivreTendancesProduitPlusVendu']);

Route::get('/statistiques/produitsEnStock', [StatistiqueController::class, 'nombreProduitsEnStock']);
Route::get('/statistiques/produitsFaibleQuantite', [StatistiqueController::class, 'produitsAvecFaibleQuantite']);
Route::get('/statistiques/clients', [StatistiqueController::class, 'nombreClients']);
Route::get('/statistiques/categories', [StatistiqueController::class, 'nombreCategories']);
Route::get('/statistiques/fournisseurs', [StatistiqueController::class, 'nombreFournisseurs']);

Route::get('/statistiques/commandesAujourdhui', [StatistiqueController::class, 'commandesAujourdhui']);
Route::get('/statistiques/commandesHier', [StatistiqueController::class, 'commandesHier']);
Route::get('/statistiques/commandesCetteSemaine', [StatistiqueController::class, 'commandesCetteSemaine']);
Route::get('/statistiques/commandesCeMois', [StatistiqueController::class, 'commandesCeMois']);
Route::get('/statistiques/commandesCetteAnnee', [StatistiqueController::class, 'commandesCetteAnnee']);


















Route::post('/login', [AuthController::class, 'login']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
