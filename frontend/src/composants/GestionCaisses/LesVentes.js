import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { FaCashRegister, FaCreditCard, FaTimesCircle, FaMoneyCheck, FaList, FaSearch } from 'react-icons/fa';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeicons/primeicons.css';

const LesVentes = () => {
    const [ventes, setVentes] = useState([]);
    const [methodePaiementFiltre, setMethodePaiementFiltre] = useState('');
    const [totauxVentes, setTotauxVentes] = useState({ "espèces": 0, "carte": 0, "Chèque": 0, "total": 0 });
    const [filtre, setFiltre] = useState('');
    const [dates, setDates] = useState({ startDate: null, endDate: null });

    useEffect(() => {
        chargerVentes();
    }, [methodePaiementFiltre, dates.startDate, dates.endDate]);

    useEffect(() => {
        const totaux = calculerTotalVentesParMethode();
        setTotauxVentes(totaux);
    }, [ventes]);

    const chargerVentes = async () => {
        let params = { methodePaiement: methodePaiementFiltre };
        try {
            const response = await axios.get(`http://localhost:8000/api/ventes`, { params });
            const filteredData = response.data.filter(vente => {
                const date = new Date(vente.created_at);
                const start = dates.startDate;
                const end = dates.endDate;
                return (!start || date >= start) && (!end || date <= end);
            });
            setVentes(filteredData);
        } catch (error) {
            console.error("Erreur lors de la récupération des données de ventes", error);
        }
    };

    const statCards = [
        { icon: <FaCashRegister />, title: "Espèces", methode: "espèces", color: "green-500" },
        { icon: <FaCreditCard />, title: "Carte bancaire", methode: "carte", color: "blue-500" },
        { icon: <FaMoneyCheck />, title: "Chèque", methode: "Chèque", color: "orange-500" },
        { icon: <FaList />, title: "Total général", methode: "", color: "purple-500" }
    ];

    const handleCardClick = (methode) => {
        setMethodePaiementFiltre(methode);
    };

    const handleFilterChange = (e) => {
        setFiltre(e.target.value.toLowerCase());
    };

    const calculerTotalVentesParMethode = () => {
        let totaux = { "espèces": 0, "carte": 0, "Chèque": 0, "total": 0 };
        ventes.forEach(vente => {
            if (vente.paiement && vente.paiement.methode) {
                const montant = parseFloat(vente.paiement.total);
                if (!isNaN(montant)) {
                    totaux[vente.paiement.methode] += montant;
                    totaux["total"] += montant;
                }
            }
        });
        return totaux;
    };

    const cardStyle = {
        backgroundColor: 'var(--color)',
        color: 'white',
        cursor: 'pointer',
        transition: 'transform 0.3s',
        marginBottom: '1em'
    };
    
    const gridStyle = {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    };

    
    return (
        <div>
         <div className="p-grid p-nogutter p-justify-between p-align-center" style={gridStyle}>
        {statCards.map((card, idx) => (
            <div className="p-col-12 p-md-6 p-lg-3" style={{ flex: '1 0 21%', margin: '0.5em' }} key={idx}>
                <Card
                    title={card.title}
                   
                    subTitle={
                        <span style={{ color: 'white' }}>
                            {`${card.methode === "" ? totauxVentes["total"].toFixed(2) : (totauxVentes[card.methode] || 0).toFixed(2)} MAD`}
                        </span>
                    }

                    style={{ ...cardStyle, backgroundColor: `var(--${card.color})` }}
                    className="p-shadow-8"
                    onClick={() => handleCardClick(card.methode)}
                >
                    <div style={{ fontSize: '2em' }}>{card.icon}</div>

                </Card>
            </div>
        ))}
    </div>
            <div className="p-grid">
                <div className="p-col-12">
                    <div className="p-inputgroup">
                    <InputText placeholder="Rechercher..." onChange={handleFilterChange} className="p-inputtext-sm" />
                    <Button icon="pi pi-search" className="p-button-rounded p-button-success" />
                    <Calendar value={dates.startDate} onChange={(e) => setDates({ ...dates, startDate: e.value })} placeholder="Date de début" />
                    <Calendar value={dates.endDate} onChange={(e) => setDates({ ...dates, endDate: e.value })} placeholder="Date de fin" />
                    <Button label="Réinitialiser" icon="pi pi-times" className="p-button-rounded p-button-warning" onClick={() => setDates({ startDate: null, endDate: null })} />
                    </div>
                </div>
                
                <div className="p-col-12 mt-3">
                <DataTable value={ventes} responsiveLayout="scroll" paginator rows={10}>
                        <Column sortable field="id" header="Commande N°"></Column>
                        <Column sortable field="created_at" header="Date de commande" body={rowData => new Date(rowData.created_at).toLocaleDateString()}></Column>
                        <Column sortable field="client.nom" header="Client"></Column>
                        <Column sortable field="paiement.total" header="Total à payer"></Column>
                        <Column sortable field="paiement.methode" header="Méthode de paiement"></Column>
                        <Column field="details" header="Détails" body={rowData => rowData.details.map((detail, idx) => <div key={idx}>{`${detail.produit.nom} - ${detail.quantite} x ${detail.prix} MAD`}</div>)}></Column>
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default LesVentes;
