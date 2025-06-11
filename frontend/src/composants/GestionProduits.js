// GestionProduits.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

const GestionProduits = () => {
  const [produits, setProduits] = useState([]);
  const emptyProduct = { id: null, nom: '', description: '', prix_achat: 0, categorie_id: null, fournisseur_id: null };
  const [filteredProduits, setFilteredProduits] = useState([]);
  const [show, setShow] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduit, setCurrentProduit] = useState({
    id: null,
    nom: '',
    description: '',
    prix_achat: '',
    categorie_id: '',
    fournisseur_id: ''
  });
  const [alert, setAlert] = useState({ show: false, message: '', variant: '' });
  const [categories, setCategories] = useState([]);
  const [fournisseurs, setFournisseurs] = useState([]);

  // Refs for Toast and Dialog components
  const toast = useRef(null);

  // Fetch categories, fournisseurs, and produits from the API
  useEffect(() => {
    fetchCategories();
    fetchFournisseurs();
    fetchProduits();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
    }
  };

  const fetchFournisseurs = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/fournisseurs');
      setFournisseurs(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des fournisseurs:', error);
    }
  };

  const fetchProduits = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/produits');
      setProduits(response.data);
      setFilteredProduits(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
    }
  };

  // Dialog functions
  const hideDialog = () => {
    setShow(false);
    setIsEditing(false);
    setCurrentProduit({ id: null, nom: '', description: '', prix_achat: '', categorie_id: '', fournisseur_id: '' });
  };

  // Handlers for product CRUD operations
  const handleShow = (produit) => {
    if (produit && produit.id != null) {
      setIsEditing(true);
      setCurrentProduit({
        ...produit,
        categorie_id: categories.find(c => c.id === produit.categorie_id), // Assurez-vous de passer l'objet complet
        fournisseur_id: fournisseurs.find(f => f.id === produit.fournisseur_id) // Assurez-vous de passer l'objet complet
      });
    } else {
      setIsEditing(false);
      setCurrentProduit(emptyProduct);
    }
    setShow(true);
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:8000/api/produits/${isEditing ? currentProduit.id : ''}`;
    const method = isEditing ? 'put' : 'post';
    const payload = {
      ...currentProduit,
      categorie_id: currentProduit.categorie_id.id, // Assurez-vous que seulement l'ID est envoyé
      fournisseur_id: currentProduit.fournisseur_id.id // Assurez-vous que seulement l'ID est envoyé
    };
  
    try {
      const response = await axios[method](url, payload);
      fetchProduits(); // Actualiser la liste des produits
      setShow(false); // Fermer le modal
      setIsEditing(false); // Réinitialiser l'état d'édition
      const successMessage = isEditing ? 'Produit mis à jour avec succès' : 'Produit ajouté avec succès';
      showToast('success', 'Succès', successMessage);
    } catch (error) {
      showToast('error', 'Erreur', 'Erreur lors du traitement du produit');
      console.error('Erreur lors du traitement du produit:', error);
    }
  };
  

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/produits/${id}`);
    fetchProduits();
  };

  // Toast function
  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail });
  };

  // Dialog footer
  const dialogFooter = (

    <div className="p-dialog-footer mt-2" style={{ display: 'flex', justifyContent: 'space-between' }}>

<Button style={{ borderRadius: '20px' }} label="Fermer" icon="pi pi-times" onClick={hideDialog} className="p-button-danger" />
     
<Button style={{ borderRadius: '20px' }} label={isEditing ? 'Mettre à jour' : 'Ajouter'}  className="p-button-help"
      
      icon="pi pi-check" onClick={handleSubmit} />

      </div>

  );

  // Your table action body template function here
  const actionBodyTemplate = (rowData) => {
    return (
      <div  style={{ display: 'flex', justifyContent: 'space-between' }}>
                       
      <Button label="Modifier" className="p-button-warning p-mr-2" style={{ borderRadius: '20px' }} onClick={() => handleShow(rowData)} />
                              
      <Button label="X" className="p-button-danger" style={{ borderRadius: '20px' }} onClick={() => handleDelete(rowData.id)} />
                          
                          
      </div>

    );
  };



  const categorieDropdownTemplate = (
    <Dropdown
      value={currentProduit.categorie_id}
      options={categories}
      onChange={(e) => setCurrentProduit({ ...currentProduit, categorie_id: e.value })}
      optionLabel="nom"
      placeholder="Sélectionnez une catégorie"
    />
  );

  const fournisseurDropdownTemplate = (
    <Dropdown
      value={currentProduit.fournisseur_id}
      options={fournisseurs}
      onChange={(e) => setCurrentProduit({ ...currentProduit, fournisseur_id: e.value })}
      optionLabel="nom"
      placeholder="Sélectionnez un fournisseur"
    />
  );

  // Template pour la colonne Catégorie
const categoryBodyTemplate = (rowData) => {
  const category = categories.find(c => c.id === rowData.categorie_id);
  return <>{category ? category.nom : 'Non défini'}</>;
};

// Template pour la colonne Fournisseur
const fournisseurBodyTemplate = (rowData) => {
  const fournisseur = fournisseurs.find(f => f.id === rowData.fournisseur_id);
  return <>{fournisseur ? fournisseur.nom : 'Non défini'}</>;
};


  // JSX for rendering the component
  return (
    <div className="mt-3">
      <Toast ref={toast} />
      <Button severity="help" label="Ajouter un produit"  style={{ borderRadius: '20px' }} 
       icon="pi pi-plus" onClick={() => handleShow(emptyProduct)} className="mb-3" />

      <DataTable value={filteredProduits} responsive paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
        <Column sortable  field="nom" header="Nom" />
        <Column sortable  field="description" header="Description" />
        <Column sortable  field="prix_achat" header="Prix d'achat" />
        <Column sortable  body={categoryBodyTemplate} header="Catégorie" />
        <Column sortable  body={fournisseurBodyTemplate} header="Fournisseur" />
        <Column  body={actionBodyTemplate} header="Actions" />
      </DataTable>


      <Dialog visible={show} style={{ width: '50vw' }} header="Détails du produit" modal className="p-fluid" footer={dialogFooter} onHide={hideDialog}>
      <div className="p-field">
        <label htmlFor="nom">Nom</label>
        <InputText id="nom" value={currentProduit.nom} onChange={(e) => setCurrentProduit({ ...currentProduit, nom: e.target.value })} />
      </div>
      <div className="p-field">
        <label htmlFor="description">Description</label>
        <InputTextarea id="description" value={currentProduit.description} onChange={(e) => setCurrentProduit({ ...currentProduit, description: e.target.value })} rows={3} />
      </div>
      <div className="p-field">
        <label htmlFor="prix_achat">Prix d'achat</label>
        <InputNumber id="prix_achat" value={currentProduit.prix_achat} onValueChange={(e) => setCurrentProduit({ ...currentProduit, prix_achat: e.value })} mode="currency" currency="MAD" locale="fr-FR" />
      </div>
      <div className="p-field">
        <label htmlFor="categorie_id">Catégorie</label>
        {categorieDropdownTemplate}
      </div>
      <div className="p-field">
        <label htmlFor="fournisseur_id">Fournisseur</label>
        {fournisseurDropdownTemplate}
      </div>
    </Dialog>
    </div>
  );
};

export default GestionProduits;
