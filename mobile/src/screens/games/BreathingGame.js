// Breathing Game
// Interactive breathing exercise with animation
// Author: StressBuster Team

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import { gameAPI } from '../../services/api';

const BreathingGame = () => {
    const [isActive, setIsActive] = useState(false);
    const [phase, setPhase] = useState('ready'); // ready, inhale, hold, exhale
    const [count, setCount] = useState(0);
    const [sessionStart, setSessionStart] = useState(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacityAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (isActive) {
            startBreathingCycle();
        }
    }, [isActive, count]);

    const startBreathingCycle = () => {
        // Inhale - 4 seconds
        setPhase('inhale');
        Animated.parallel([
            Animated.timing(scaleAnim, {
                toValue: 1.5,
                duration: 4000,
                useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
                toValue: 0.8,
                duration: 4000,
                useNativeDriver: true,
            }),
        ]).start(() => {
            // Hold - 4 seconds
            setPhase('hold');
            setTimeout(() => {
                // Exhale - 4 seconds
                setPhase('exhale');
                Animated.parallel([
                    Animated.timing(scaleAnim, {
                        toValue: 1,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(opacityAnim, {
                        toValue: 1,
                        duration: 4000,
                        useNativeDriver: true,
                    }),
                ]).start(() => {
                    setCount(prev => prev + 1);
                });
            }, 4000);
        });
    };

    const startSession = () => {
        setIsActive(true);
        setSessionStart(Date.now());
        setCount(0);
    };

    const stopSession = async () => {
        setIsActive(false);
        setPhase('ready');

        if (sessionStart) {
            const duration = Math.floor((Date.now() - sessionStart) / 1000);
            try {
                await gameAPI.saveSession({
                    gameType: 'breathing',
                    durationSeconds: duration,
                    score: count,
                    completed: true,
                });
            } catch (error) {
                console.error('Error saving session:', error);
            }
        }
    };

    const getPhaseText = () => {
        switch (phase) {
            case 'inhale': return 'Breathe In';
            case 'hold': return 'Hold';
            case 'exhale': return 'Breathe Out';
            default: return 'Ready to Begin';
        }
    };

    const getPhaseColor = () => {
        switch (phase) {
            case 'inhale': return colors.breathingIn;
            case 'exhale': return colors.breathingOut;
            default: return colors.primary;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Breathing Exercise</Text>
                <Text style={styles.subtitle}>Follow the circle to breathe</Text>

                <View style={styles.circleContainer}>
                    <Animated.View
                        style={[
                            styles.circle,
                            {
                                backgroundColor: getPhaseColor(),
                                transform: [{ scale: scaleAnim }],
                                opacity: opacityAnim,
                            },
                        ]}
                    >
                        <Text style={styles.phaseText}>{getPhaseText()}</Text>
                    </Animated.View>
                </View>

                <Text style={styles.countText}>Cycles: {count}</Text>

                <TouchableOpacity
                    style={[styles.button, isActive && styles.stopButton]}
                    onPress={isActive ? stopSession : startSession}
                >
                    <Icon
                        name={isActive ? 'stop' : 'play'}
                        size={24}
                        color={colors.textInverse}
                    />
                    <Text style={styles.buttonText}>
                        {isActive ? 'Stop' : 'Start'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.instructions}>
                <Text style={styles.instructionTitle}>Instructions:</Text>
                <Text style={styles.instructionText}>• Inhale as the circle expands (4s)</Text>
                <Text style={styles.instructionText}>• Hold your breath (4s)</Text>
                <Text style={styles.instructionText}>• Exhale as the circle shrinks (4s)</Text>
                <Text style={styles.instructionText}>• Repeat for 5-10 minutes</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
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
        marginBottom: 40,
    },
    circleContainer: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 40,
    },
    circle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    phaseText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.textInverse,
    },
    countText: {
        fontSize: 18,
        color: colors.text,
        marginBottom: 30,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
    },
    stopButton: {
        backgroundColor: colors.error,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textInverse,
        marginLeft: 8,
    },
    instructions: {
        backgroundColor: colors.surface,
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    instructionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 12,
    },
    instructionText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 6,
    },
});

export default BreathingGame;
