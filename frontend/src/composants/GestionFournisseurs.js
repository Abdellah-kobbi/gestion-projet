import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Form, Modal, Card, Container, Row, Col } from 'react-bootstrap';
import { Button } from 'primereact/button';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { FiUser, FiMail, FiPhone, FiHome } from 'react-icons/fi'; // Importing required icons
import './GestionFournisseurs.css';


const GestionFournisseurs = () => {
    const [fournisseurs, setFournisseurs] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentFournisseur, setCurrentFournisseur] = useState({ id: null, nom: '', adresse: '', telephone: '', email: '' });

    useEffect(() => {
        fetchFournisseurs();
    }, []);

    const fetchFournisseurs = async () => {
        const response = await axios.get('http://localhost:8000/api/fournisseurs');
        setFournisseurs(response.data);
    };

    const handleShow = (fournisseur = { nom: '', adresse: '', telephone: '', email: '' }, editing = false) => {
        setCurrentFournisseur(fournisseur);
        setIsEditing(editing);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setCurrentFournisseur({ nom: '', adresse: '', telephone: '', email: '' });
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentFournisseur({ ...currentFournisseur, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await axios.put(`http://localhost:8000/api/fournisseurs/${currentFournisseur.id}`, currentFournisseur);
        } else {
            await axios.post('http://localhost:8000/api/fournisseurs', currentFournisseur);
        }
        fetchFournisseurs();
        handleClose();
    };

    const handleDelete = async (id) => {
        await axios.delete(`http://localhost:8000/api/fournisseurs/${id}`);
        fetchFournisseurs();
    };

    return (
        <Container>
<Button
    label="Ajouter un fournisseur"
    icon={<FaPlus />}
    severity="info"
    className="p-button-info mb-3"
    onClick={() => handleShow()}
    style={{ borderRadius: '20px' }} // Augmentez ou diminuez selon la courbure désirée
/>


            <Row xs={1} md={2} lg={3} className="g-4">
                {fournisseurs.map(fournisseur => (
                    <Col key={fournisseur.id}>
                        <Card>
                            <Card.Body>
                                <Card.Title className='text-center'><FiUser /> {fournisseur.nom}</Card.Title>
                                <Card.Text>
                                    <FiHome /> Adresse: {fournisseur.adresse}<br /><br />
                                    <FiPhone /> Téléphone: {fournisseur.telephone}<br /><br />
                                    <FiMail /> Email: {fournisseur.email}
                                </Card.Text>

                                
                                <div  style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    
                                <Button severity="warning" style={{ borderRadius: '20px' }}  
                                onClick={() => handleShow(fournisseur, true)}>
                                    <FaEdit /> Modifier
                                </Button>

                                <Button severity="help" style={{ borderRadius: '20px' }} onClick={() => handleDelete(fournisseur.id)} className="ms-2">
                                    Supprimer
                                </Button>

                                </div>

                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Modifier le fournisseur' : 'Ajouter un fournisseur'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="formNom">
                            <Form.Label><FiUser /> Nom</Form.Label>
                            <Form.Control type="text" placeholder="Entrez le nom" name="nom" value={currentFournisseur.nom} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formAdresse">
                            <Form.Label><FiHome /> Adresse</Form.Label>
                            <Form.Control type="text" placeholder="Entrez l'adresse" name="adresse" value={currentFournisseur.adresse} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTelephone">
                            <Form.Label><FiPhone /> Téléphone</Form.Label>
                            <Form.Control type="text" placeholder="Entrez le numéro de téléphone" name="telephone" value={currentFournisseur.telephone} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formEmail">
                            <Form.Label><FiMail /> Email</Form.Label>
                            <Form.Control type="email" placeholder="Entrez l'email" name="email" value={currentFournisseur.email} onChange={handleChange} required />
                        </Form.Group>


 <div className="modal-footer">
 <Button severity="info"  style={{ borderRadius: '20px' }} type="submit">{isEditing ? 'Mettre à jour' : 'Ajouter'}</Button>
</div>

                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default GestionFournisseurs;
