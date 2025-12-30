// Authentication Context
// Provides global authentication state and methods
// Author: StressBuster Team

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Alert } from 'react-native';
import { authAPI } from '../services/api';
import {
    saveAuthToken,
    getAuthToken,
    saveUserData,
    getUserData,
    removeAuthToken,
    removeUserData
} from '../services/storage';

// Create context
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(false);

    // Check for existing auth on app start
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const storedToken = await getAuthToken();
            const storedUser = await getUserData();

            if (storedToken && storedUser) {
                // Validate that user data has required fields
                if (storedUser.email && storedUser.userId) {
                    setToken(storedToken);
                    setUser(storedUser);
                    setIsAuthenticated(true);
                } else {
                    // Invalid user data, clear it
                    console.log('Invalid stored user data, clearing...');
                    await removeAuthToken();
                    await removeUserData();
                }
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            // Clear potentially corrupted data
            await removeAuthToken();
            await removeUserData();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }

        // Validate password length
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return false;
        }

        setAuthLoading(true);
        try {
            const response = await authAPI.login({ email, password });

            // Save token and user data
            await saveAuthToken(response.data.token);
            await saveUserData(response.data);

            // Update state
            setToken(response.data.token);
            setUser(response.data);
            setIsAuthenticated(true);

            Alert.alert('Success', 'Logged in successfully!');
            return true;
        } catch (error) {
            Alert.alert('Error', error.message || 'Login failed');
            return false;
        } finally {
            setAuthLoading(false);
        }
    };

    const register = async (userData) => {
        // Validate required fields
        if (!userData.username || !userData.email || !userData.password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return false;
        }

        // Validate password length
        if (userData.password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return false;
        }

        // Validate username length
        if (userData.username.length < 3) {
            Alert.alert('Error', 'Username must be at least 3 characters');
            return false;
        }

        setAuthLoading(true);
        try {
            const response = await authAPI.register(userData);

            // Save token and user data
            await saveAuthToken(response.data.token);
            await saveUserData(response.data);

            // Update state
            setToken(response.data.token);
            setUser(response.data);
            setIsAuthenticated(true);

            Alert.alert('Success', 'Registration successful!');
            return true;
        } catch (error) {
            Alert.alert('Error', error.message || 'Registration failed');
            return false;
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Clear storage
            await removeAuthToken();
            await removeUserData();

            // Clear state
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);

            Alert.alert('Success', 'Logged out successfully');
        } catch (error) {
            console.error('Error during logout:', error);
            Alert.alert('Error', 'Failed to logout');
        }
    };

    const value = {
        user,
        token,
        isAuthenticated,
        loading,
        authLoading,
        login,
        register,
        logout,
        checkAuth
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
