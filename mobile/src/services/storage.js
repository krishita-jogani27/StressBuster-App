// Storage Service
// AsyncStorage wrapper for local data persistence
// Author: StressBuster Team

import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// AUTH TOKEN MANAGEMENT
// ============================================
export const saveAuthToken = async (token) => {
    try {
        await AsyncStorage.setItem('authToken', token);
        return true;
    } catch (error) {
        console.error('Error saving auth token:', error);
        return false;
    }
};

export const getAuthToken = async () => {
    try {
        const token = await AsyncStorage.getItem('authToken');
        return token;
    } catch (error) {
        console.error('Error getting auth token:', error);
        return null;
    }
};

export const removeAuthToken = async () => {
    try {
        await AsyncStorage.removeItem('authToken');
        return true;
    } catch (error) {
        console.error('Error removing auth token:', error);
        return false;
    }
};

// ============================================
// USER DATA MANAGEMENT
// ============================================
export const saveUserData = async (userData) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        return true;
    } catch (error) {
        console.error('Error saving user data:', error);
        return false;
    }
};

export const getUserData = async () => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};

export const removeUserData = async () => {
    try {
        await AsyncStorage.removeItem('userData');
        return true;
    } catch (error) {
        console.error('Error removing user data:', error);
        return false;
    }
};

// ============================================
// CHAT SESSION MANAGEMENT
// ============================================
export const saveChatSession = async (sessionId, messages) => {
    try {
        await AsyncStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
        return true;
    } catch (error) {
        console.error('Error saving chat session:', error);
        return false;
    }
};

export const getChatSession = async (sessionId) => {
    try {
        const messages = await AsyncStorage.getItem(`chat_${sessionId}`);
        return messages ? JSON.parse(messages) : [];
    } catch (error) {
        console.error('Error getting chat session:', error);
        return [];
    }
};

// ============================================
// PREFERENCES MANAGEMENT
// ============================================
export const savePreference = async (key, value) => {
    try {
        await AsyncStorage.setItem(`pref_${key}`, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('Error saving preference:', error);
        return false;
    }
};

export const getPreference = async (key, defaultValue = null) => {
    try {
        const value = await AsyncStorage.getItem(`pref_${key}`);
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        console.error('Error getting preference:', error);
        return defaultValue;
    }
};

// ============================================
// CLEAR ALL DATA
// ============================================
export const clearAllData = async () => {
    try {
        await AsyncStorage.clear();
        return true;
    } catch (error) {
        console.error('Error clearing all data:', error);
        return false;
    }
};
