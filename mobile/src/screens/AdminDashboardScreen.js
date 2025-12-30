// Admin Dashboard Screen
// Dashboard for admin users with analytics and controls
// Author: StressBuster Team

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import colors from '../constants/colors';
import axios from 'axios';

const API_BASE_URL = 'http://10.105.168.15:5001/api';

const AdminDashboardScreen = () => {
    const { user, logout } = useAuth();
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            console.log('Loading analytics...');
            const analyticsResponse = await axios.get(`${API_BASE_URL}/admin/analytics`);
            console.log('Analytics loaded successfully');

            console.log('Loading users...');
            const recentUsersResponse = await axios.get(`${API_BASE_URL}/users?limit=10`).catch(err => {
                console.error('Users endpoint error:', err.response?.data || err.message);
                return { data: { data: [] } };
            });

            console.log('Loading games...');
            const recentGamesResponse = await axios.get(`${API_BASE_URL}/games/sessions?limit=10`).catch(err => {
                console.error('Games endpoint error:', err.response?.data || err.message);
                return { data: { data: [] } };
            });

            console.log('Loading appointments...');
            const recentAppointmentsResponse = await axios.get(`${API_BASE_URL}/appointments?limit=10`).catch(err => {
                console.error('Appointments endpoint error:', err.response?.data || err.message);
                return { data: { data: [] } };
            });

            setAnalytics({
                ...analyticsResponse.data.data,
                recentUsers: recentUsersResponse.data.data || [],
                recentGames: recentGamesResponse.data.data || [],
                recentAppointments: recentAppointmentsResponse.data.data || []
            });

            console.log('All data loaded successfully');
        } catch (error) {
            console.error('Error loading analytics:', error);
            console.error('Error details:', error.response?.data);
            console.error('Error status:', error.response?.status);
            console.error('Error URL:', error.config?.url);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadAnalytics();
    };

    const handleLogout = () => {
        logout();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={styles.loadingText}>Loading Analytics...</Text>
            </View>
        );
    }

    const overview = analytics?.overview || {};
    const gameEngagement = analytics?.gameEngagement || [];
    const recentUsers = analytics?.recentUsers || [];
    const recentGames = analytics?.recentGames || [];
    const recentAppointments = analytics?.recentAppointments || [];

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Welcome Back,</Text>
                    <Text style={styles.adminName}>{user?.full_name || user?.username || 'Admin'}</Text>
                    <View style={styles.roleBadge}>
                        <Ionicons name="shield-checkmark" size={16} color={colors.textInverse} />
                        <Text style={styles.roleText}>{user?.role?.toUpperCase() || 'ADMIN'}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={24} color={colors.textInverse} />
                </TouchableOpacity>
            </View>

            {/* Overview Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="people" size={32} color={colors.primary} />
                    <Text style={styles.statNumber}>{overview.total_users || 0}</Text>
                    <Text style={styles.statLabel}>Total Users</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="log-in" size={32} color={colors.success} />
                    <Text style={styles.statNumber}>{overview.active_users || 0}</Text>
                    <Text style={styles.statLabel}>Active Users</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="calendar" size={32} color={colors.warning} />
                    <Text style={styles.statNumber}>{overview.total_appointments || 0}</Text>
                    <Text style={styles.statLabel}>Appointments</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="game-controller" size={32} color={colors.error} />
                    <Text style={styles.statNumber}>{overview.total_game_sessions || 0}</Text>
                    <Text style={styles.statLabel}>Games Played</Text>
                </View>
            </View>

            {/* Chatbot Activity */}
            <View style={styles.card}>
                <View style={styles.cardHeader}>
                    <Ionicons name="chatbubbles" size={24} color={colors.primary} />
                    <Text style={styles.cardTitle}>Chatbot Activity</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Total Conversations:</Text>
                    <Text style={styles.infoValue}>{overview.total_chatbot_queries || 0}</Text>
                </View>
            </View>

            {/* Recent Users */}
            {recentUsers.length > 0 && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="person-add" size={24} color={colors.success} />
                        <Text style={styles.cardTitle}>Recent Users ({recentUsers.length})</Text>
                    </View>
                    {recentUsers.slice(0, 5).map((user, index) => (
                        <View key={index} style={styles.activityItem}>
                            <Text style={styles.activityText}>{user.full_name || user.username}</Text>
                            <Text style={styles.activityTime}>
                                {new Date(user.created_at).toLocaleDateString()}
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Recent Games */}
            {recentGames.length > 0 && (
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Ionicons name="game-controller" size={24} color={colors.primary} />
                        <Text style={styles.cardTitle}>Recent Games ({recentGames.length})</Text>
                    </View>
                    {recentGames.slice(0, 5).map((game, index) => (
                        <View key={index} style={styles.activityItem}>
                            <Text style={styles.activityText}>
                                {game.game_type.replace('_', ' ').toUpperCase()}
                            </Text>
                            <Text style={styles.activityTime}>
                                {Math.round(game.duration_seconds)}s
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Refresh Info */}
            <Text style={styles.refreshInfo}>Pull down to refresh analytics</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: colors.textSecondary,
    },
    header: {
        backgroundColor: colors.primary,
        padding: 20,
        paddingTop: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    greeting: {
        fontSize: 16,
        color: colors.textInverse,
        opacity: 0.9,
    },
    adminName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textInverse,
        marginTop: 4,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    roleText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textInverse,
        marginLeft: 4,
    },
    logoutButton: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 16,
        gap: 12,
    },
    statCard: {
        flex: 1,
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textSecondary,
        marginTop: 4,
        textAlign: 'center',
    },
    card: {
        backgroundColor: colors.surface,
        margin: 16,
        marginTop: 8,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 12,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    activityItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    activityText: {
        fontSize: 14,
        color: colors.text,
    },
    activityTime: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    refreshInfo: {
        textAlign: 'center',
        fontSize: 12,
        color: colors.textSecondary,
        padding: 16,
        paddingBottom: 32,
    },
});

export default AdminDashboardScreen;
