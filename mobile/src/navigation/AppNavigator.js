// App Navigator - Expo Version
// Main navigation structure for the app
// Author: StressBuster Team

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import ResourceHubScreen from '../screens/ResourceHubScreen';
import GamesScreen from '../screens/GamesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';

// Game screens
import BreathingGame from '../screens/games/BreathingGame';
import TapToRelaxGame from '../screens/games/TapToRelaxGame';
import MemoryPuzzleGame from '../screens/games/MemoryPuzzleGame';

import colors from '../constants/colors';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator (for regular users)
const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    switch (route.name) {
                        case 'Home':
                            iconName = focused ? 'home' : 'home-outline';
                            break;
                        case 'Chat':
                            iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
                            break;
                        case 'Appointments':
                            iconName = focused ? 'calendar' : 'calendar-outline';
                            break;
                        case 'Resources':
                            iconName = focused ? 'library' : 'library-outline';
                            break;
                        case 'Games':
                            iconName = focused ? 'game-controller' : 'game-controller-outline';
                            break;
                        case 'Profile':
                            iconName = focused ? 'person' : 'person-outline';
                            break;
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.textInverse,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Chat" component={ChatbotScreen} />
            <Tab.Screen name="Appointments" component={AppointmentScreen} />
            <Tab.Screen name="Resources" component={ResourceHubScreen} />
            <Tab.Screen name="Games" component={GamesScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'My Profile' }} />
        </Tab.Navigator>
    );
};

// Loading screen
const LoadingScreen = () => (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
    </View>
);

// Root Stack Navigator with conditional rendering
const AppNavigator = () => {
    const { isAuthenticated, user, loading } = useAuth();

    // Show loading screen while checking auth
    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.textInverse,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            {!isAuthenticated ? (
                // Auth screens (not logged in)
                <>
                    <Stack.Screen
                        name="Login"
                        component={LoginScreen}
                        options={{ title: 'Login', headerShown: false }}
                    />
                    <Stack.Screen
                        name="Register"
                        component={RegisterScreen}
                        options={{ title: 'Register' }}
                    />
                </>
            ) : user?.isAdmin ? (
                // Admin screens
                <>
                    <Stack.Screen
                        name="AdminDashboard"
                        component={AdminDashboardScreen}
                        options={{ title: 'Admin Dashboard', headerShown: false }}
                    />
                </>
            ) : (
                // Regular user screens
                <>
                    <Stack.Screen
                        name="MainTabs"
                        component={MainTabs}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="BreathingGame"
                        component={BreathingGame}
                        options={{ title: 'Breathing Exercise' }}
                    />
                    <Stack.Screen
                        name="TapToRelaxGame"
                        component={TapToRelaxGame}
                        options={{ title: 'Tap to Relax' }}
                    />
                    <Stack.Screen
                        name="MemoryPuzzleGame"
                        component={MemoryPuzzleGame}
                        options={{ title: 'Memory Puzzle' }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
});

export default AppNavigator;
