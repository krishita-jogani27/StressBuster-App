// Home Screen - Expo Version
// Main dashboard screen with quick access to all features
// Author: StressBuster Team

import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../components/common/Card';
import colors from '../constants/colors';
import strings from '../constants/strings';
import { resourceAPI, helplineAPI } from '../services/api';

const HomeScreen = ({ navigation }) => {
    const [featuredResources, setFeaturedResources] = useState([]);
    const [helplines, setHelplines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            // Load both in parallel
            await Promise.all([
                loadFeaturedResources(),
                loadHelplines()
            ]);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Unable to load data. Please check your connection.');
        } finally {
            setLoading(false);
        }
    };

    const loadFeaturedResources = async () => {
        try {
            const response = await resourceAPI.getFeaturedResources();
            setFeaturedResources(response.data.slice(0, 3));
        } catch (error) {
            console.error('Error loading featured resources:', error);
            // Don't throw - allow app to continue with empty resources
        }
    };

    const loadHelplines = async () => {
        try {
            const response = await helplineAPI.getHelplines();
            setHelplines(response.data.slice(0, 2));
        } catch (error) {
            console.error('Error loading helplines:', error);
            // Don't throw - allow app to continue with empty helplines
        }
    };

    const QuickAccessCard = ({ title, icon, color, onPress }) => (
        <TouchableOpacity style={styles.quickAccessCard} onPress={onPress}>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
                <Ionicons name={icon} size={32} color={colors.textInverse} />
            </View>
            <Text style={styles.quickAccessText}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.welcomeSection}>
                <Text style={styles.welcomeTitle}>{strings.welcomeMessage}</Text>
                <Text style={styles.welcomeSubtitle}>{strings.welcomeSubtitle}</Text>
            </View>

            <View style={styles.quickAccessGrid}>
                <QuickAccessCard
                    title="AI Chat Support"
                    icon="chatbubbles"
                    color={colors.primary}
                    onPress={() => navigation.navigate('Chat')}
                />
                <QuickAccessCard
                    title="Book Counseling"
                    icon="calendar"
                    color={colors.secondary}
                    onPress={() => navigation.navigate('Appointments')}
                />
                <QuickAccessCard
                    title="Stress Games"
                    icon="game-controller"
                    color={colors.accent}
                    onPress={() => navigation.navigate('Games')}
                />
                <QuickAccessCard
                    title="Resources"
                    icon="library"
                    color={colors.calm}
                    onPress={() => navigation.navigate('Resources')}
                />
            </View>

            <Card style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="call" size={24} color={colors.error} />
                    <Text style={styles.sectionTitle}>Emergency Helplines</Text>
                </View>
                {helplines.map((helpline) => (
                    <TouchableOpacity
                        key={helpline.id}
                        style={styles.helplineItem}
                        onPress={() => Alert.alert('Call', `Call ${helpline.phone}?`)}
                    >
                        <View>
                            <Text style={styles.helplineName}>{helpline.name}</Text>
                            <Text style={styles.helplinePhone}>{helpline.phone}</Text>
                        </View>
                        <Ionicons name="call-outline" size={24} color={colors.primary} />
                    </TouchableOpacity>
                ))}
            </Card>

            <Card style={styles.section}>
                <Text style={styles.sectionTitle}>Featured Resources</Text>
                {featuredResources.map((resource) => (
                    <View key={resource.id} style={styles.resourceItem}>
                        <Ionicons name="play-circle" size={24} color={colors.primary} />
                        <View style={styles.resourceInfo}>
                            <Text style={styles.resourceTitle}>{resource.title}</Text>
                            <Text style={styles.resourceType}>{resource.resource_type}</Text>
                        </View>
                    </View>
                ))}
            </Card>

            <Card style={[styles.section, styles.tipCard]}>
                <Ionicons name="bulb" size={28} color={colors.accent} />
                <Text style={styles.tipTitle}>Daily Wellness Tip</Text>
                <Text style={styles.tipText}>
                    Take 5 minutes today to practice deep breathing. Inhale for 4 counts, hold for 4, exhale for 4.
                </Text>
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    welcomeSection: {
        padding: 20,
        backgroundColor: colors.primary,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.textInverse,
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: colors.textInverse,
        opacity: 0.9,
    },
    quickAccessGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
        justifyContent: 'space-between',
    },
    quickAccessCard: {
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    quickAccessText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
        textAlign: 'center',
    },
    section: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 8,
        marginBottom: 12,
    },
    helplineItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    helplineName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    helplinePhone: {
        fontSize: 14,
        color: colors.textSecondary,
        marginTop: 4,
    },
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    resourceInfo: {
        marginLeft: 12,
        flex: 1,
    },
    resourceTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },
    resourceType: {
        fontSize: 13,
        color: colors.textSecondary,
        marginTop: 2,
        textTransform: 'capitalize',
    },
    tipCard: {
        backgroundColor: colors.primaryLight,
        padding: 20,
    },
    tipTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 12,
        marginBottom: 8,
    },
    tipText: {
        fontSize: 15,
        color: colors.text,
        lineHeight: 22,
    },
});

export default HomeScreen;
