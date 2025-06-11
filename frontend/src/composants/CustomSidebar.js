import React, { useState, useEffect } from 'react';
import { Nav, Accordion } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUnlock, FiBarChart, FiBarChart2, FiGrid, FiBox, FiTruck, FiUsers, FiTag, FiShoppingCart, FiLogOut, FiPackage } from 'react-icons/fi';
import logo from '../composants/img/logo.png';

import 'bootstrap/dist/css/bootstrap.min.css';

const CustomSidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [activeKey, setActiveKey] = useState('0');

    const handleLogout = async () => {
        await logout();
        navigate('/login'); // Navigate to login page after logout
    };

    const setSidebarHeight = () => {
        const sidebar = document.getElementById('custom-sidebar');
        if (sidebar) {
            const windowHeight = window.innerHeight;
            sidebar.style.height = windowHeight + 'px';
        }
    };

    useEffect(() => {
        setSidebarHeight();
        window.addEventListener('resize', setSidebarHeight);
        return () => window.removeEventListener('resize', setSidebarHeight);
    }, []);

    // Fonction pour vérifier le rôle de l'utilisateur
    const checkUserRole = (roles) => {
        return user && roles.includes(user.role);
    };

    return (
        <div id="custom-sidebar" className="d-flex flex-column flex-shrink-0 p-3 bg-light" style={{ width: '280px', overflowY: 'auto' }}>
            <div className="d-flex justify-content-center" style={{ minHeight: '50px' }}>
                <img src={logo} alt="Logo" style={{ maxWidth: '75%', height: 'auto' }} />
            </div>
            <hr />
			 <ul className="nav nav-pills flex-column mb-auto">
			
			
			
			 <li className="nav-item">
                    <LinkContainer to="/tableaudebord">
                        <Nav.Link className="nav-link" activeClassName="active">
                            <FiHome className="me-2" />Tableau de Bord
                        </Nav.Link>
                    </LinkContainer>
                </li>
			
			
			
           
                {checkUserRole(['admin', 'ResponsableStock']) && (
                    <li>
                         <Accordion defaultActiveKey="0" activeKey={activeKey} onSelect={(e) => setActiveKey(e)}>
                       <Accordion.Item eventKey="1">
                            <Accordion.Header><FiGrid className="me-2" />Gestion Stock</Accordion.Header>
                            <Accordion.Body>
                                <ul className="nav flex-column">
                                    <li className="nav-item">
                                        <LinkContainer to="/produitsenstock">
                                            <Nav.Link className="nav-link" activeClassName="active">
                                                <FiBox className="me-2" />Produits en Stock
                                            </Nav.Link>
                                        </LinkContainer>
                                    </li>
                                    <li className="nav-item">
                                        <LinkContainer to="/mouvementsstock">
                                            <Nav.Link className="nav-link" activeClassName="active">
                                                <FiTruck className="me-2" />Stock Mouvements
                                            </Nav.Link>
                                        </LinkContainer>
                                    </li>
                                    <li className="nav-item">
                                        <LinkContainer to="/entrepots">
                                            <Nav.Link className="nav-link" activeClassName="active">
                                                <FiPackage className="me-2" />Entrepôts
                                            </Nav.Link>
                                        </LinkContainer>
                                    </li>
                                    <li className="nav-item">
                                        <LinkContainer to="/ajustementsstock">
                                            <Nav.Link className="nav-link" activeClassName="active">
                                                <FiTag className="me-2" />Stock Ajustements
                                            </Nav.Link>
                                        </LinkContainer>
                                    </li>
                                </ul>
                                </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </li>
                )}

                {checkUserRole(['admin', 'GestionnaireProduits']) && (
                    <li className="nav-item">
                        <LinkContainer to="/gestionproduits">
                            <Nav.Link className="nav-link" activeClassName="active">
                                <FiShoppingCart className="me-2" />Gestion Produits
                            </Nav.Link>
                        </LinkContainer>
                    </li>
                )}

                {checkUserRole(['admin', 'ResponsableCommandes']) && (
                    <li>
                         <Accordion defaultActiveKey="0" activeKey={activeKey} onSelect={(e) => setActiveKey(e)}>
                        <Accordion.Item eventKey="2">
                            <Accordion.Header><FiGrid className="me-2" />Gestion Commandes</Accordion.Header>
                            <Accordion.Body>
                                <ul className="nav flex-column">
								
                                    <li className="nav-item">
                                         <LinkContainer to="/commandeform">
                        <Nav.Link className="nav-link" activeClassName="active">
                            <FiShoppingCart className="me-2" />Nouveau Commande
                        </Nav.Link>
                    </LinkContainer>
                                    </li>
									
									
                                    <li className="nav-item">
                                        <LinkContainer to="/listecommandes">
                        <Nav.Link className="nav-link" activeClassName="active">
                            <FiShoppingCart className="me-2" />Liste Commandes
                        </Nav.Link>
                    </LinkContainer>
                                    </li>

                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    </li>
                )}

{checkUserRole(['admin', 'ResponsableAchats']) && (
                    <>
                        <li className="nav-item">
                            <LinkContainer to="/gestionfournisseurs">
                                <Nav.Link className="nav-link" activeClassName="active">
                                    <FiUsers className="me-2" />Gestion Fournisseurs
                                </Nav.Link>
                            </LinkContainer>
                        </li>
                      
                    </>
                )}
				
				
				
				{checkUserRole(['admin','ResponsableVentes']) && (
                    <>
                        
                        <li className="nav-item">
                            <LinkContainer to="/gestionclients">
                                <Nav.Link className="nav-link" activeClassName="active">
                                    <FiUsers className="me-2" />Gestion Clients
                                </Nav.Link>
                            </LinkContainer>
                        </li>
                      
                       
                    </>
                )}
				
				
				{checkUserRole(['admin','ResponsableCategories']) && (
                    <>
                        
                        <li className="nav-item">
                            <LinkContainer to="/gestioncategories">
                                <Nav.Link className="nav-link" activeClassName="active">
                                    <FiTag className="me-2" />Gestion Catégories
                                </Nav.Link>
                            </LinkContainer>
                        </li>
                    </>
                )}

                {checkUserRole(['admin', 'Caissier']) && (
                    <>
                        <li>
                    <Accordion defaultActiveKey="0" activeKey={activeKey} onSelect={(e) => setActiveKey(e)}>
                        <Accordion.Item eventKey="3">
                            <Accordion.Header><FiGrid className="me-2" />Gestion Caisse</Accordion.Header>
                            <Accordion.Body>
                                <ul className="nav flex-column">
								
								



<LinkContainer to="/lesventes">
    <Nav.Link className="nav-link" activeClassName="active">
        <FiBarChart2 className="me-2" />Les Ventes
    </Nav.Link>
</LinkContainer>



                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </li>
                    </>
                )}

                {checkUserRole(['admin', 'Analyste']) && (
                    <li className="nav-item">
                        <LinkContainer to="/rapports">
                            <Nav.Link className="nav-link" activeClassName="active">
                                <FiBarChart className="me-2" />Rapports
                            </Nav.Link>
                        </LinkContainer>
                    </li>
                )}

                <hr />
                <li className="nav-item">
                    <Nav.Link className="nav-link" onClick={handleLogout}>
                        <FiLogOut className="me-2" />Déconnexion
                    </Nav.Link>
                </li>
            </ul>
        </div>

    );
};

export default CustomSidebar;
