// Login Screen
// User authentication
// Author: StressBuster Team

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import colors from '../constants/colors';
import { useAuth } from '../contexts/AuthContext';
import { clearAllData } from '../services/storage';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, authLoading } = useAuth();

    const handleLogin = async () => {
        // Validation and navigation handled by AuthContext
        await login(email, password);
    };

    const handleClearCache = () => {
        Alert.alert(
            'Clear All Data',
            'This will clear all cached data including login info. You will need to login again. Continue?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await clearAllData();
                        Alert.alert('Success', 'All cached data cleared! App will reload.');
                        // Force reload by updating state
                        setEmail('');
                        setPassword('');
                    }
                }
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Dev Menu Button */}
            <TouchableOpacity
                style={styles.devButton}
                onPress={handleClearCache}
            >
                <Ionicons name="trash-outline" size={20} color={colors.textSecondary} />
                <Text style={styles.devButtonText}>Clear Cache</Text>
            </TouchableOpacity>

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
                loading={authLoading}
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
        paddingTop: 60,
    },
    devButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: colors.surface,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
    },
    devButtonText: {
        fontSize: 12,
        color: colors.textSecondary,
        marginLeft: 4,
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
