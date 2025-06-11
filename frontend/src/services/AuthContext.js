// src/services/AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

export const AuthContext = createContext({}); // Initialiser avec un objet vide


export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { /* Informations utilisateur ou juste {} */ } : null;
  });
  


  const login = async (email, password) => {
    try {
        const response = await axios.post('http://localhost:8000/api/login', { email, password });
        const { token, role } = response.data;
        localStorage.setItem('token', token);
        setUser({ email, role });
    } catch (error) {
        console.error("Erreur de connexion:", error);
        throw error;
    }
};
  

const logout = async (callback) => {
  try {
    await axios.post('http://localhost:8000/api/logout');
    localStorage.removeItem('token');
    setUser(null);
    if (callback) callback(); // Utiliser le callback pour naviguer
  } catch (error) {
    console.error('Logout Error', error);
  }
};



  const value = {
    user,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
