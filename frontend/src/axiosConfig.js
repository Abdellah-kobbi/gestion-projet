//axiosConfig.js
import axios from 'axios';

// Assurez-vous que withCredentials est défini pour les requêtes cross-origin
axios.defaults.withCredentials = true;

axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // Ajouter cette ligne si elle n'est pas déjà présente
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    return config;
  },
  error => Promise.reject(error)
);
