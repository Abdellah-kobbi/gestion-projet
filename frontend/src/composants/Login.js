import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../services/AuthContext';
import { FaUser, FaLock } from 'react-icons/fa';
import avatar from '../composants/img/logo.jpg';
import stock1 from '../composants/img/stock.jpeg'; 
import stock2 from '../composants/img/stock2.jpeg'; 
import './Login.css'; // Import du fichier CSS externe

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [backgroundImage, setBackgroundImage] = useState(stock2);

    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundImage(currentImage => currentImage === stock1 ? stock2 : stock1);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const csrf = async () => axios.get("http://localhost:8000/sanctum/csrf-cookie");

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await csrf();
            await login(email, password);
            navigate('/tableaudebord');
        } catch (err) {
            setError(err.response?.data?.message || 'Une erreur est survenue');
        }
    };

    return (
        <div style={{
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                width: '390px',
                padding: '40px',
                background: 'white',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                borderRadius: '10px',
                zIndex: 2
            }} className="form-container"> {/* Classe appliquée ici pour l'animation */}
                <form onSubmit={handleSubmit}>
                    <center>
                        <img src={avatar} alt="Avatar" style={{ height: '120px', marginBottom: '29px' }} />
                    </center>
                    {error && <div style={{ color: 'red' }}>{error}</div>}
                    <div style={{
                        marginBottom: '20px',
                        borderBottom: '2px solid #d9d9d9',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <FaUser style={{ color: '#007BFF', marginRight: '10px' }} />
                        <input 
                            type="email" 
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px'
                            }} 
                            placeholder="Email" 
                            required 
                            maxLength="45" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                    </div>
                    <div style={{
                        marginBottom: '20px',
                        borderBottom: '2px solid #d9d9d9',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <FaLock style={{ color: '#007BFF', marginRight: '10px' }} />
                        <input 
                            type="password" 
                            style={{
                                border: 'none',
                                outline: 'none',
                                width: '100%',
                                padding: '10px',
                                fontSize: '16px'
                            }} 
                            placeholder="Mot de passe" 
                            required 
                            maxLength="40" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                        />
                    </div>
                    <button type="submit" style={{
                        width: '100%',
                        padding: '15px',
                        border: 'none',
                        background: 'linear-gradient(to right, #007BFF, #38d39f)',
                        color: 'white',
                        fontSize: '16px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        outline: 'none',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
                    }}>
                        Connexion
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
