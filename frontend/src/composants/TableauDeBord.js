import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './axiosSetup'; // Importe la configuration d'axios
import { Chart } from 'primereact/chart';

export default function TableauDeBord() {
    const [barChartData, setBarChartData] = useState({});
    const [stockPieData, setStockPieData] = useState({});
    const [clientPieData, setClientPieData] = useState({});

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                // Préparation des URLs des endpoints
                const statsEndpoints = [
                    { key: 'Aujourd\'hui', url: 'http://localhost:8000/api/statistiques/commandesAujourdhui' },
                    { key: 'Hier', url: 'http://localhost:8000/api/statistiques/commandesHier' },
                    { key: 'Cette Semaine', url: 'http://localhost:8000/api/statistiques/commandesCetteSemaine' },
                    { key: 'Ce Mois', url: 'http://localhost:8000/api/statistiques/commandesCeMois' },
                    { key: 'Cette Année', url: 'http://localhost:8000/api/statistiques/commandesCetteAnnee' },
                ];

                // Exécution des requêtes de commandes en parallèle
                const commandResponses = await Promise.all(
                    statsEndpoints.map(endpoint => axios.get(endpoint.url))
                );

                const barData = {
                    labels: statsEndpoints.map(stat => stat.key),
                    datasets: [{
                        label: 'Nombre de Commandes',
                        backgroundColor: '#864AF9',
                        data: commandResponses.map(response => response.data)
                    }]
                };

                setBarChartData(barData);

                // Exécution des requêtes pour les stocks et clients
                const otherStatsResponses = await Promise.all([
                    axios.get('http://localhost:8000/api/statistiques/produitsEnStock'),
                    axios.get('http://localhost:8000/api/statistiques/produitsFaibleQuantite'),
                    axios.get('http://localhost:8000/api/statistiques/clients'),
                    axios.get('http://localhost:8000/api/statistiques/categories'),
                    axios.get('http://localhost:8000/api/statistiques/fournisseurs')
                ]);

                const stockData = {
                    labels: ['Produits en Stock', 'Produits à Faible Quantité'],
                    datasets: [{
                        data: [otherStatsResponses[0].data, otherStatsResponses[1].data],
                        backgroundColor: ['#42A5F5', '#FFA726']
                    }]
                };

                const clientData = {
                    labels: ['Clients', 'Catégories', 'Fournisseurs'],
                    datasets: [{
                        data: [otherStatsResponses[2].data, otherStatsResponses[3].data, otherStatsResponses[4].data],
                        backgroundColor: ['#66BB6A', '#FFCA28', '#FF7043']
                    }]
                };

                setStockPieData(stockData);
                setClientPieData(clientData);
            } catch (error) {
                console.error("Error fetching data:", error);
                // Afficher une notification d'erreur ou quelque chose de similaire
            }
        };

        fetchStatistics();
    }, []);

    // Styles des graphiques
    const commonOptions = {
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    };

    const chartStyle = { height: '350px', maxWidth: '900px', margin: 'auto' };
    const pieChartContainerStyle = { display: 'flex', justifyContent: 'space-around', alignItems: 'center' };
    const pieChartStyle = { width: '27%', textAlign: 'center' };

    return (
        <div>
        <div className="card mt-0">
            <div style={pieChartContainerStyle}>
                <div style={pieChartStyle}>
                    <Chart type="pie" data={stockPieData}/>
                </div>
                <div style={pieChartStyle}>
                    <Chart type="pie" data={clientPieData}/>
                </div>
            </div>
            <br />
            <div>
                <Chart style={chartStyle} type="bar" data={barChartData} options={commonOptions} />
            </div> <br/>
        </div>
        </div>
    );
}
