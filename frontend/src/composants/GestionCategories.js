import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Modal, Alert, Container, Card } from 'react-bootstrap';
import { FiPlusCircle, FiEdit2, FiTrash2, FiFolder } from 'react-icons/fi';
import { Accordion, AccordionTab } from 'primereact/accordion'; // Importing Accordion and AccordionTab from PrimeReact
import './GestionCategories.css';

const GestionCategories = () => {
    const [categories, setCategories] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalCategory, setModalCategory] = useState({ id: '', nom: '', description: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/categories');
            setCategories(response.data);
        } catch (error) {
            setAlert({ show: true, message: "Erreur lors de la récupération des catégories.", variant: 'danger' });
        }
    };

    const handleShow = (category = { id: '', nom: '', description: '' }, editing = false) => {
        setModalCategory(category);
        setIsEditing(editing);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setModalCategory(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const actionUrl = `http://localhost:8000/api/categories/${isEditing ? `${modalCategory.id}` : ''}`;
        const method = isEditing ? 'put' : 'post';

        try {
            await axios[method](actionUrl, modalCategory);
            fetchCategories();
            handleClose();
            setAlert({ show: true, message: `Catégorie ${isEditing ? 'modifiée' : 'ajoutée'} avec succès.`, variant: 'success' });
        } catch (error) {
            setAlert({ show: true, message: `Erreur lors de ${isEditing ? 'la modification' : "l'ajout"} d'une catégorie.`, variant: 'danger' });
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/api/categories/${id}`);
            fetchCategories();
            setAlert({ show: true, message: "Catégorie supprimée avec succès.", variant: 'success' });
        } catch (error) {
            setAlert({ show: true, message: "Erreur lors de la suppression d'une catégorie.", variant: 'danger' });
        }
    };

    return (
        <Container fluid="md mt-2">
            <Alert show={alert.show} variant={alert.variant}>{alert.message}</Alert>

            <Button variant="dark" onClick={() => handleShow()} className="mb-3">
                <FiPlusCircle /> Ajouter une catégorie
            </Button>

            <Accordion>
                {categories.map(category => (
                    <AccordionTab header={category.nom} key={category.id}>
                        <Card>
                            <Card.Body>
                                <Card.Text>{category.description}</Card.Text>
                                <Button variant="dark" onClick={() => handleShow(category, true)} className="me-2">
                                    <FiEdit2 /> Modifier
                                </Button>
                                <Button variant="danger" onClick={() => handleDelete(category.id)}>
                                    <FiTrash2 /> Supprimer
                                </Button>
                            </Card.Body>
                        </Card>
                    </AccordionTab>
                ))}
            </Accordion>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{isEditing ? 'Modifier' : 'Ajouter'} une catégorie</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Nom</Form.Label>
                            <Form.Control type="text" name="nom" value={modalCategory.nom} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} name="description" value={modalCategory.description} onChange={handleChange} />
                        </Form.Group>
                        <div className="modal-footer justify-content-between">
                            <Button variant="secondary" onClick={handleClose} className="me-2">
                                Fermer
                            </Button>
                            <Button variant="dark" type="submit">
                                Enregistrer
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default GestionCategories;
