// Tap to Relax Game
// Interactive tapping game for stress relief
// Author: StressBuster Team

import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
} from 'react-native';
import colors from '../../constants/colors';
import { gameAPI } from '../../services/api';

const TapToRelaxGame = () => {
    const [score, setScore] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [sessionStart, setSessionStart] = useState(null);
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const timerRef = useRef(null);

    const startGame = () => {
        setIsActive(true);
        setScore(0);
        setTimeLeft(60);
        setSessionStart(Date.now());

        timerRef.current = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    endGame();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const endGame = async () => {
        setIsActive(false);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        if (sessionStart) {
            const duration = Math.floor((Date.now() - sessionStart) / 1000);
            try {
                await gameAPI.saveSession({
                    gameType: 'tap_to_relax',
                    durationSeconds: duration,
                    score: score,
                    completed: true,
                });
            } catch (error) {
                console.error('Error saving session:', error);
            }
        }
    };

    const handleTap = () => {
        if (!isActive) return;

        setScore(prev => prev + 1);

        // Animate tap
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Score</Text>
                    <Text style={styles.statValue}>{score}</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statLabel}>Time</Text>
                    <Text style={styles.statValue}>{timeLeft}s</Text>
                </View>
            </View>

            <View style={styles.gameArea}>
                <Text style={styles.instruction}>
                    {isActive ? 'Tap the circle to release stress!' : 'Press Start to begin'}
                </Text>

                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={handleTap}
                    disabled={!isActive}
                >
                    <Animated.View
                        style={[
                            styles.tapCircle,
                            !isActive && styles.tapCircleInactive,
                            { transform: [{ scale: scaleAnim }] },
                        ]}
                    >
                        <Text style={styles.tapText}>TAP</Text>
                    </Animated.View>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.button, isActive && styles.stopButton]}
                onPress={isActive ? endGame : startGame}
            >
                <Text style={styles.buttonText}>
                    {isActive ? 'Stop Game' : 'Start Game'}
                </Text>
            </TouchableOpacity>

            <View style={styles.info}>
                <Text style={styles.infoTitle}>How to Play:</Text>
                <Text style={styles.infoText}>
                    Tap the circle as many times as you can in 60 seconds. Each tap helps
                    release tension and stress. Focus on the rhythm and let go of worries.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 40,
    },
    statBox: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: 20,
        borderRadius: 16,
        minWidth: 120,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statLabel: {
        fontSize: 14,
        color: colors.textSecondary,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.primary,
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    instruction: {
        fontSize: 18,
        color: colors.text,
        textAlign: 'center',
        marginBottom: 40,
    },
    tapCircle: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: colors.tapActive,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: colors.tapActive,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    tapCircleInactive: {
        backgroundColor: colors.textLight,
        shadowColor: '#000',
    },
    tapText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textInverse,
    },
    button: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginVertical: 20,
    },
    stopButton: {
        backgroundColor: colors.error,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textInverse,
    },
    info: {
        backgroundColor: colors.surface,
        padding: 16,
        borderRadius: 12,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});

export default TapToRelaxGame;
