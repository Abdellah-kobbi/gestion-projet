import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { Alert } from 'react-bootstrap';
import { FiPlus,FaPlus, FiEdit, FiTrash2, FiBox } from 'react-icons/fi';
import { SplitButton } from 'primereact/splitbutton';

const ProduitsEnStock = () => {
    const [produitsEnStock, setProduitsEnStock] = useState([]);
    const [produits, setProduits] = useState([]);
    const [show, setShow] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedProduit, setSelectedProduit] = useState(null);
    const [quantiteInitiale, setQuantiteInitiale] = useState('');
    const [quantiteActuelle, setQuantiteActuelle] = useState('');
    const [prixVente, setPrixVente] = useState('');
    const [currentId, setCurrentId] = useState(null);
    const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastSeverity, setToastSeverity] = useState('');

    useEffect(() => {
        fetchProduitsEnStock();
        fetchProduits();
    }, []);

    const fetchProduitsEnStock = async () => {
        const res = await axios.get('http://localhost:8000/api/produits_en_stock');
        setProduitsEnStock(res.data);
    };

    const fetchProduits = async () => {
        const res = await axios.get('http://localhost:8000/api/produits');
        setProduits(res.data.filter(produit => !produitsEnStock.some(p => p.produit_id === produit.id)));
    };

    const handleClose = () => {
        setShow(false);
        setIsEditing(false);
        resetForm();
    };

    const handleShow = (produitEnStock = null) => {
        if (produitEnStock) {
            setIsEditing(true);
            setCurrentId(produitEnStock.id);
            setQuantiteInitiale(produitEnStock.quantite_initiale);
            setQuantiteActuelle(produitEnStock.quantite_actuelle);
            setPrixVente(produitEnStock.prix_vente);
    
            // Trouver le produit correspondant dans la liste des produits
            const produit = produits.find(p => p.id === produitEnStock.produit_id);
            setSelectedProduit(produit); // Sélectionner le produit correspondant
        } else {
            setIsEditing(false);
            setCurrentId(null);
            resetForm();
        }
        setShow(true);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = {
            produit_id: selectedProduit.id,
            quantite_initiale: quantiteInitiale,
            quantite_actuelle: quantiteActuelle,
            prix_vente: prixVente,
        };

        try {
            if (isEditing) {
                await axios.put(`http://localhost:8000/api/produits_en_stock/${currentId}`, data);
                setAlert({ show: true, message: 'Produit en stock mis à jour avec succès.', type: 'success' });
                setToastSeverity('success');
                setToastMessage('Produit en stock mis à jour avec succès.');
            } else {
                await axios.post('http://localhost:8000/api/produits_en_stock', data);
                setAlert({ show: true, message: 'Produit ajouté en stock avec succès.', type: 'success' });
                setToastSeverity('success');
                setToastMessage('Produit ajouté en stock avec succès.');
            }
            fetchProduitsEnStock();
            handleClose();
            setToastVisible(true);
        } catch (error) {
            console.error('Erreur lors de l\'ajout/mise à jour du produit en stock', error);
            setAlert({ show: true, message: 'Erreur lors de l\'ajout/mise à jour du produit.', type: 'danger' });
            setToastSeverity('error');
            setToastMessage('Erreur lors de l\'ajout/mise à jour du produit.');
            setToastVisible(true);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/produits_en_stock/${id}`);
            setAlert({ show: true, message: 'Produit en stock supprimé avec succès.', type: 'success' });
            fetchProduitsEnStock();
            setToastSeverity('success');
            setToastMessage('Produit en stock supprimé avec succès.');
            setToastVisible(true);
        } catch (error) {
            console.error('Erreur lors de la suppression du produit en stock', error);
            setAlert({ show: true, message: 'Erreur lors de la suppression du produit.', type: 'danger' });
            setToastSeverity('error');
            setToastMessage('Erreur lors de la suppression du produit.');
            setToastVisible(true);
        }
    };

    const resetForm = () => {
        setSelectedProduit(null);
        setQuantiteInitiale('');
        setQuantiteActuelle('');
        setPrixVente('');
        setCurrentId(null);
    };

    return (
        <div className="mt-3">
            <Alert show={alert.show} variant={alert.type} onClose={() => setAlert({ ...alert, show: false })} dismissible>
                {alert.message}
            </Alert>
            <Toast visible={toastVisible} severity={toastSeverity} onClose={() => setToastVisible(false)} life={3000}>
                {toastMessage}
            </Toast>

            <Button label="Ajouter un produit en stock" 
            icon={<FiPlus />} 
            className="p-button-secondary mb-3" 
            style={{ borderRadius: '20px' }} 
            onClick={() => handleShow()}/>



            <DataTable value={produitsEnStock} responsive paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                <Column sortable field="id" header={<FiBox />} />
                <Column sortable field="produit.nom" header="Produit" />
                <Column sortable field="quantite_initiale" header="Quantité Initiale" />
                <Column sortable field="quantite_actuelle" header="Quantité Actuelle" />
                <Column sortable field="prix_vente" header="Prix de Vente" />
                
                
                <Column header="Actions" body={(rowData) => (
                   <div  style={{ display: 'flex', justifyContent: 'space-between' }}>
                       
<Button label="Modifier" className="p-button-warning p-mr-2" style={{ borderRadius: '20px' }} onClick={() => handleShow(rowData)} />
                        
<Button label="X" className="p-button-secondary" style={{ borderRadius: '20px' }} onClick={() => handleDelete(rowData.id)} />
                    
                    
                    </div>
                )} />



            </DataTable>
            <Dialog visible={show} style={{ width: '450px' }} header={isEditing ? 'Modifier le produit en stock' : 'Ajouter un produit en stock'} onHide={handleClose}>
                <form onSubmit={handleSubmit}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="produitSelect">Produit</label>
                            <Dropdown id="produitSelect" value={selectedProduit} options={produits} optionLabel="nom" onChange={(e) => setSelectedProduit(e.value)} placeholder="Sélectionnez un produit" showClear required />
                        </div>
                        <div className="p-field">
                            <label htmlFor="quantiteInitiale">Quantité Initiale</label>
                            <InputNumber id="quantiteInitiale" value={quantiteInitiale} onValueChange={(e) => setQuantiteInitiale(e.value)} required />
                        </div>
                        <div className="p-field">
                            <label htmlFor="quantiteActuelle">Quantité Actuelle</label>
                            <InputNumber id="quantiteActuelle" value={quantiteActuelle} onValueChange={(e) => setQuantiteActuelle(e.value)} required />
                        </div>
                        <div className="p-field">
                            <label htmlFor="prixVente">Prix de Vente</label>
                            <InputNumber id="prixVente" value={prixVente} onValueChange={(e) => setPrixVente(e.value)} mode="currency" currency="MAD" locale="fr-FR" required />
                        </div>
                    </div>

                    <div className="p-dialog-footer mt-4" style={{ display: 'flex', justifyContent: 'space-between' }}>

    <Button label="Fermer" icon="pi pi-times" className="p-button-danger"  style={{ borderRadius: '20px' }} onClick={handleClose} />
    <Button label={isEditing ? 'Mettre à jour' : 'Ajouter'} className={isEditing ?  'p-button-warning p-mr-2' : 'p-button-secondary p-mr-2'}  
    style={{ borderRadius: '20px' }} icon="pi pi-check" type="submit" /> 

</div>

                </form>
            </Dialog>
        </div>
    );
};

export default ProduitsEnStock;
