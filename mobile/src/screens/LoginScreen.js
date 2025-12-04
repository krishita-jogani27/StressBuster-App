// Login Screen
// User authentication
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

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await authAPI.login({ email, password });
            await saveAuthToken(response.data.token);
            await saveUserData(response.data);
            Alert.alert('Success', 'Logged in successfully!');
            navigation.navigate('MainTabs');
        } catch (error) {
            Alert.alert('Error', error.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Login to continue your wellness journey</Text>

            <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <Input
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
            />

            <Button
                title="Login"
                onPress={handleLogin}
                loading={loading}
                style={styles.button}
            />

            <Button
                title="Don't have an account? Register"
                onPress={() => navigation.navigate('Register')}
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

export default LoginScreen;
