// Register Screen
// User registration
// Author: StressBuster Team

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import colors from '../constants/colors';
import { authAPI } from '../services/api';
import { saveAuthToken, saveUserData } from '../services/storage';

const RegisterScreen = ({ navigation }) => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
    });
    const [loading, setLoading] = useState(false);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRegister = async () => {
        if (!formData.username || !formData.email || !formData.password) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.register(formData);
            await saveAuthToken(response.data.token);
            await saveUserData(response.data);
            Alert.alert('Success', 'Account created successfully!');
            navigation.navigate('MainTabs');
        } catch (error) {
            Alert.alert('Error', error.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join us on your wellness journey</Text>

            <Input
                label="Username *"
                value={formData.username}
                onChangeText={(value) => updateField('username', value)}
                placeholder="Choose a username"
                autoCapitalize="none"
            />

            <Input
                label="Full Name"
                value={formData.full_name}
                onChangeText={(value) => updateField('full_name', value)}
                placeholder="Enter your full name"
            />

            <Input
                label="Email *"
                value={formData.email}
                onChangeText={(value) => updateField('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Input
                label="Password *"
                value={formData.password}
                onChangeText={(value) => updateField('password', value)}
                placeholder="Create a password (min 6 characters)"
                secureTextEntry
            />

            <Button
                title="Register"
                onPress={handleRegister}
                loading={loading}
                style={styles.button}
            />

            <Button
                title="Already have an account? Login"
                onPress={() => navigation.navigate('Login')}
                variant="outline"
                style={styles.button}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: colors.textSecondary,
        marginBottom: 30,
    },
    button: {
        marginTop: 16,
    },
});

export default RegisterScreen;
