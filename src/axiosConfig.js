// src/axiosConfig.js
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000', // L'URL de base pour vos requêtes
    headers: {
        'Content-Type': 'application/json', // En-tête par défaut
    },
});

// Ajouter un interceptor pour inclure le jeton d'accès dans les en-têtes
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

export default axiosInstance;
