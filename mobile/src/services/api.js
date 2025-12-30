// API Service
// Centralized API client for backend communication
// Author: StressBuster Team

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base API URL - Using local network IP for physical device testing
// Change this to your computer's actual IP if different
const API_BASE_URL = 'http://10.105.168.181:5000/api';

// Create axios instance
const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        if (error.response) {
            // Server responded with error
            return Promise.reject(error.response.data);
        } else if (error.request) {
            // No response received
            return Promise.reject({ message: 'Network error. Please check your connection.' });
        } else {
            // Request setup error
            return Promise.reject({ message: error.message });
        }
    }
);

// ============================================
// AUTH APIs
// ============================================
export const authAPI = {
    register: (userData) => apiClient.post('/auth/register', userData),
    login: (credentials) => apiClient.post('/auth/login', credentials),
};

// ============================================
// USER APIs
// ============================================
export const userAPI = {
    getProfile: () => apiClient.get('/users/profile'),
    updateProfile: (profileData) => apiClient.put('/users/profile', profileData),
};

// ============================================
// CHATBOT APIs
// ============================================
export const chatbotAPI = {
    sendMessage: (message, sessionId) => apiClient.post('/chatbot/message', { message, sessionId }),
    getConversation: (sessionId) => apiClient.get(`/chatbot/conversation/${sessionId}`),
};

// ============================================
// APPOINTMENT APIs
// ============================================
export const appointmentAPI = {
    getCounselors: () => apiClient.get('/appointments/counselors'),
    getAvailableSlots: (counselorId, date) => apiClient.get(`/appointments/slots/${counselorId}/${date}`),
    bookAppointment: (appointmentData) => apiClient.post('/appointments', appointmentData),
    getMyAppointments: () => apiClient.get('/appointments/my'),
    cancelAppointment: (appointmentId) => apiClient.put(`/appointments/${appointmentId}/cancel`),
};

// ============================================
// RESOURCE APIs
// ============================================
export const resourceAPI = {
    getCategories: () => apiClient.get('/resources/categories'),
    getResources: (filters) => apiClient.get('/resources', { params: filters }),
    getResource: (resourceId) => apiClient.get(`/resources/${resourceId}`),
    getFeaturedResources: () => apiClient.get('/resources/featured/list'),
};

// ============================================
// GAME APIs
// ============================================
export const gameAPI = {
    saveSession: (sessionData) => apiClient.post('/games/sessions', sessionData),
    getMySessions: () => apiClient.get('/games/sessions/my'),
    getStats: () => apiClient.get('/games/stats'),
};

// ============================================
// HELPLINE APIs
// ============================================
export const helplineAPI = {
    getHelplines: () => apiClient.get('/helplines'),
};

export default apiClient;
