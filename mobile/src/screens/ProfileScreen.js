// Profile Screen
// User profile management
// Author: StressBuster Team

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import colors from '../constants/colors';
import { userAPI } from '../services/api';
import { removeAuthToken, removeUserData } from '../services/storage';

const ProfileScreen = ({ navigation }) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await userAPI.getProfile();
            setProfile(response.data);
        } catch (error) {
            Alert.alert('Error', 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await removeAuthToken();
                        await removeUserData();
                        navigation.navigate('Login');
                    },
                },
            ]
        );
    };

    if (loading) {
        return <Loading message="Loading profile..." />;
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    <Icon name="person-circle" size={80} color={colors.primary} />
                </View>
                <Text style={styles.name}>{profile?.full_name || profile?.username}</Text>
                <Text style={styles.email}>{profile?.email}</Text>
            </View>

            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Account Information</Text>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Username:</Text>
                    <Text style={styles.infoValue}>{profile?.username}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Email:</Text>
                    <Text style={styles.infoValue}>{profile?.email}</Text>
                </View>
                {profile?.phone && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Phone:</Text>
                        <Text style={styles.infoValue}>{profile.phone}</Text>
                    </View>
                )}
                {profile?.age && (
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Age:</Text>
                        <Text style={styles.infoValue}>{profile.age}</Text>
                    </View>
                )}
            </Card>

            <Card style={styles.section}>
                <TouchableOpacity style={styles.menuItem}>
                    <Icon name="calendar-outline" size={24} color={colors.primary} />
                    <Text style={styles.menuText}>My Appointments</Text>
                    <Icon name="chevron-forward" size={24} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Icon name="game-controller-outline" size={24} color={colors.primary} />
                    <Text style={styles.menuText}>Game History</Text>
                    <Icon name="chevron-forward" size={24} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem}>
                    <Icon name="settings-outline" size={24} color={colors.primary} />
                    <Text style={styles.menuText}>Settings</Text>
                    <Icon name="chevron-forward" size={24} color={colors.textSecondary} />
                </TouchableOpacity>
            </Card>

            <Button
                title="Logout"
                onPress={handleLogout}
                variant="outline"
                style={styles.logoutButton}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: colors.surface,
    },
    avatarContainer: {
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: colors.textSecondary,
    },
    section: {
        margin: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    infoLabel: {
        fontSize: 15,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
        marginLeft: 16,
    },
    logoutButton: {
        margin: 16,
    },
});

export default ProfileScreen;
