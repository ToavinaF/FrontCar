// src/axiosConfig.js
import axios from 'axios';
import { API_URL, BASE_URL } from './apiConfig';

const axiosInstance = axios.create({
    baseURL: API_URL, // L'URL de base pour vos requêtes
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
