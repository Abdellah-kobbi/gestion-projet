import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Chart } from 'primereact/chart';
import 'primereact/resources/themes/saga-blue/theme.css'; //theme
import 'primereact/resources/primereact.css'; //core css
import 'primeicons/primeicons.css'; //


const RapportVentes = () => {
    const [typeRapport, setTypeRapport] = useState('produit');
    const [dateDebut, setDateDebut] = useState(null);
    const [dateFin, setDateFin] = useState(null);
    const [rapports, setRapports] = useState([]);
    const [tendancesProduit, setTendancesProduit] = useState([]);

    useEffect(() => {
        // Optionally, fetch initial data here
    }, []);

    const fetchRapport = async () => {
        try {
            const endpoint = `http://localhost:8000/api/rapports/ventes-par-${typeRapport}`;
            const { data } = await axios.get(endpoint, {
                params: { dateDebut, dateFin }
            });
            setRapports(data);
        } catch (error) {
            console.error("Erreur lors de la récupération du rapport", error);
        }
    };

    const fetchTendancesProduit = async () => {
        try {
            const endpoint = `http://localhost:8000/api/rapports/tendances-produit-plus-vendu`;
            const { data } = await axios.get(endpoint, {
                params: { dateDebut, dateFin }
            });
            setTendancesProduit(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des tendances de vente", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchRapport();
        fetchTendancesProduit();
    };

    const reportOptions = [
        { label: 'Par Produit', value: 'produit' },
        { label: 'Par Client', value: 'client' }
    ];

    return (
        <div className="p-grid p-align-center p-justify-center mt-2">
            <div className="p-col-12">
            <marquee> <h2 className='p-text-center'>Rapport des Ventes</h2> </marquee>  
                
                <hr/>


                <form onSubmit={handleSubmit} className="p-fluid">
                
                <div className="p-grid">
                <div className="p-col-12">
                    <div className="p-inputgroup">
                        
                            
                            <Dropdown inputId="typeRapport" value={typeRapport} options={reportOptions} onChange={e => setTypeRapport(e.value)} placeholder="Sélectionnez un type"/>
                        
                        
                            <Calendar placeholder='Date de Début' id="dateDebut" value={dateDebut} onChange={(e) => setDateDebut(e.value)} showIcon />
                        
                        
                            <Calendar placeholder='Date de Fin' id="dateFin" value={dateFin} onChange={(e) => setDateFin(e.value)} showIcon />
                        
                        
                            <Button label="Générer Rapport" icon="pi pi-check" className="p-button-rounded p-button-success p-mt-2" />
                        
                    </div> </div> </div>
                </form>


            </div>
            <div className="p-col-12 mt-4">
                <DataTable value={rapports} className="p-mt-2" responsiveLayout="scroll">
                    <Column field={typeRapport === 'produit' ? 'produit' : 'clientNomComplet'} header="Produit/Client" sortable></Column>
                    <Column field="quantite" header="Quantité" sortable></Column>
                    <Column field="totalVente" header="Total Vente" sortable></Column>
                </DataTable>
            </div>
            <div className="p-col-12 mt-4">

              <marquee> <h2 className='p-text-center p-mt-4'>Tendances du Produit le Plus Vendu</h2> </marquee>  
                <DataTable value={tendancesProduit} className="p-mt-2" responsiveLayout="scroll">
                    <Column field="produit" header="Produit" sortable></Column>
                    <Column field="quantite_vendue" header="Quantité Vendue" sortable></Column>
                    <Column field="tendance" header="Tendance" body={(rowData) => rowData.tendance === 'up' ? <i className="pi pi-arrow-up" style={{ color: 'green' }}></i> : <i className="pi pi-arrow-down" style={{ color: 'red' }}></i>}></Column>
                </DataTable>
            </div>
        </div>
    );
    
};

export default RapportVentes;
