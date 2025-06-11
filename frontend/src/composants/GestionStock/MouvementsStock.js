
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { Alert } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { FiTruck } from 'react-icons/fi';
import { InputText } from 'primereact/inputtext';
const MouvementsStock = () => {
    const [mouvements, setMouvements] = useState([]);
    const [produitsEnStock, setProduitsEnStock] = useState([]);
    const [entrepots, setEntrepots] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentMouvement, setCurrentMouvement] = useState({ produitEnStockId: '', entrepotId: '', type_mouvement: '', quantite: '', date: '' });
    const [alert, setAlert] = useState({ show: false, message: '', variant: '' });

    useEffect(() => {
        fetchMouvements();
        fetchProduitsEnStock();
        fetchEntrepots();
    }, []);

    const fetchMouvements = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/mouvements_stock');
            setMouvements(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des mouvements:', error);
        }
    };

    const fetchProduitsEnStock = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/produits_en_stock');
            console.log("Produits en stock:", response.data); // Ajouter ce log pour vérifier les données
            setProduitsEnStock(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits en stock:', error);
        }
    };
    
    const fetchEntrepots = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/entrepots');
            console.log("Entrepôts:", response.data); // Ajouter ce log pour vérifier les données
            setEntrepots(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des entrepôts:', error);
        }
    };
    

    const handleShow = (mouvement = null) => {
        console.log("Mouvement reçu pour modification:", mouvement);
        if (mouvement) {
            setCurrentMouvement({
                id: mouvement.id,
                produitEnStockId: mouvement.produit_id, // Utilisez l'ID directement
                entrepotId: mouvement.entrepot_id, // Utilisez l'ID directement
                type_mouvement: mouvement.type_mouvement,
                quantite: mouvement.quantite,
                date: new Date(mouvement.date) // Convertir en objet Date si nécessaire
            });
        } else {
            setCurrentMouvement({
                produitEnStockId: '',
                entrepotId: '',
                type_mouvement: '',
                quantite: '',
                date: new Date()
            });
        }
        setShowModal(true);
    };
    
    
    
    
    
    

    const handleClose = () => {
        setShowModal(false);
        setCurrentMouvement({ produitEnStockId: '', entrepotId: '', type_mouvement: '', quantite: '', date: new Date() });
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentMouvement({ ...currentMouvement, [name]: value });
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = {
            produit_id: currentMouvement.produitEnStockId.id, // Assurez-vous d'envoyer seulement l'ID
            entrepot_id: currentMouvement.entrepotId.id, // De même ici
            type_mouvement: currentMouvement.type_mouvement,
            quantite: currentMouvement.quantite,
            date: currentMouvement.date instanceof Date ? currentMouvement.date.toISOString().substring(0, 10) : currentMouvement.date,
        };
    
        console.log("Données soumises:", data); // Pour vérifier les données
    
        try {
            const method = currentMouvement.id ? 'put' : 'post';
            const url = currentMouvement.id
                ? `http://localhost:8000/api/mouvements_stock/${currentMouvement.id}`
                : 'http://localhost:8000/api/mouvements_stock';
    
            const response = await axios[method](url, data);
    
            setAlert({
                show: true,
                message: `Mouvement ${currentMouvement.id ? 'modifié' : 'ajouté'} avec succès!`,
                variant: 'success'
            });
    
            fetchMouvements();
            handleClose();
        } catch (error) {
            console.error('Erreur lors de la soumission:', error.response ? error.response.data : error);
            setAlert({
                show: true,
                message: `Erreur lors de la soumission: ${error.response && error.response.data && error.response.data.detail ? error.response.data.detail : 'Erreur non spécifiée'}`,
                variant: 'danger'
            });
        }
    };
    
    
    




    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/mouvements_stock/${id}`);
            setAlert({ show: true, message: 'Mouvement supprimé avec succès!', variant: 'success' });
            fetchMouvements();
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            setAlert({ show: true, message: 'Erreur lors de la suppression du mouvement.', variant: 'danger' });
        }
    };


    const typesDeMouvement = [
        { label: 'Entrée', value: 'entrée' },
        { label: 'Sortie', value: 'sortie' },
        { label: 'Transfert', value: 'transfert' },
        { label: 'Ajustement', value: 'ajustement' }
    ];

    return (
        <div className="mt-3">
            {alert.show && (
                <Alert variant={alert.variant} onClose={() => setAlert({ show: false })} dismissible>
                    {alert.message}
                </Alert>
            )}

<Button
    label="Ajouter Mouvement"
    icon={<FaPlus />}
    className="p-button-help mb-3"
    onClick={() => handleShow()}
    style={{ borderRadius: '20px' }} // Augmentez ou diminuez selon la courbure désirée
/>



           
            <DataTable value={mouvements} responsive paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                <Column sortable field="id" header={<FiTruck />} />
                <Column sortable field="nomProduit" header="Produit" />
                <Column sortable field="entrepot.nom" header="Entrepôt" />
                <Column sortable field="type_mouvement" header="Type de Mouvement" />
                <Column sortable field="quantite" header="Quantité" />
                <Column sortable field="date" header="Date" />
                <Column header="Actions" body={(rowData) => (
                    <div>
                      
 <Button label="X" className="p-button-help"  style={{ borderRadius: '20px' }} onClick={() => handleDelete(rowData.id)} />
                    </div>
                )} />
            </DataTable>

            <Dialog visible={showModal} style={{ width: '450px' }} header={currentMouvement.id ? 'Modifier Mouvement' : 'Ajouter Mouvement'} onHide={handleClose}>
                <form onSubmit={handleSubmit}>
                    <div className="p-fluid">
                        <div className="p-field">
                            <label htmlFor="produitEnStockId">Produit</label>


<Dropdown
    value={currentMouvement.produitEnStockId}
    options={produitsEnStock}
    optionLabel="produit.nom" // 'nom' doit être la propriété textuelle dans l'objet produit
    onChange={(e) => setCurrentMouvement({ ...currentMouvement, produitEnStockId: e.value })}
    placeholder="Sélectionnez un produit"
/>

                        </div>
                        <div className="p-field">
                          
                          
                          
                            <label htmlFor="entrepotId">Entrepôt</label>

                            <Dropdown
    value={currentMouvement.entrepotId}
    options={entrepots}
    optionLabel="nom" // 'nom' doit être la propriété textuelle dans l'objet entrepôt
    onChange={(e) => setCurrentMouvement({ ...currentMouvement, entrepotId: e.value })}
    placeholder="Sélectionnez un entrepôt"
/>  
                        </div>




                        <div className="p-field">
                            <label htmlFor="type_mouvement">Type de Mouvement</label>
                            <Dropdown
    value={currentMouvement.type_mouvement}
    options={typesDeMouvement}
    onChange={(e) => setCurrentMouvement({ ...currentMouvement, type_mouvement: e.value })}
    optionLabel="label"
    placeholder="Sélectionnez un type de mouvement"
/>                        </div>
                        <div className="p-field">
                            <label htmlFor="quantite">Quantité</label>
                            <InputNumber id="quantite" value={currentMouvement.quantite} onChange={(e) => setCurrentMouvement({ ...currentMouvement, quantite: e.value })} />
                        </div>
                        <div className="p-field">
                            <label htmlFor="date">Date</label>
                            <Calendar id="date" value={new Date(currentMouvement.date)} onChange={(e) => setCurrentMouvement({ ...currentMouvement, date: e.value })} />
                        </div>
                    </div>
                    <div className="p-dialog-footer mt-2">
                       
<Button style={{ borderRadius: '20px' }}
className={currentMouvement.id ?  'p-button-help p-mr-2' : 'p-button-help p-mr-2'} 
label={currentMouvement.id ? 'Mettre à jour' : 'Ajouter'} icon="pi pi-check" type="submit" />

                    </div>
                </form>
            </Dialog>
        </div>
    );
};

export default MouvementsStock;