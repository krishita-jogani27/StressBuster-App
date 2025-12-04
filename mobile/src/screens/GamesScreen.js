// Games Screen
// Hub for stress-buster games
// Author: StressBuster Team

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from '../components/common/Card';
import colors from '../constants/colors';

const GamesScreen = ({ navigation }) => {
    const games = [
        {
            id: 1,
            title: 'Breathing Exercise',
            description: 'Guided breathing to calm your mind and reduce stress',
            icon: 'fitness',
            color: colors.breathingIn,
            screen: 'BreathingGame',
        },
        {
            id: 2,
            title: 'Tap to Relax',
            description: 'Interactive tapping game to release tension',
            icon: 'hand-left',
            color: colors.tapActive,
            screen: 'TapToRelaxGame',
        },
        {
            id: 3,
            title: 'Memory Puzzle',
            description: 'Calming memory game to focus your mind',
            icon: 'grid',
            color: colors.memoryMatch,
            screen: 'MemoryPuzzleGame',
        },
    ];

    const GameCard = ({ game }) => (
        <TouchableOpacity
            onPress={() => navigation.navigate(game.screen)}
        >
            <Card style={styles.gameCard}>
                <View style={[styles.iconContainer, { backgroundColor: game.color }]}>
                    <Icon name={game.icon} size={40} color={colors.textInverse} />
                </View>
                <View style={styles.gameInfo}>
                    <Text style={styles.gameTitle}>{game.title}</Text>
                    <Text style={styles.gameDescription}>{game.description}</Text>
                    <View style={styles.playButton}>
                        <Text style={styles.playText}>Play Now</Text>
                        <Icon name="arrow-forward" size={20} color={colors.primary} />
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Stress-Buster Games</Text>
                <Text style={styles.headerSubtitle}>
                    Take a break and relax with these calming activities
                </Text>
            </View>

            {games.map(game => (
                <GameCard key={game.id} game={game} />
            ))}

            <Card style={styles.tipCard}>
                <Icon name="information-circle" size={24} color={colors.info} />
                <Text style={styles.tipTitle}>How it helps</Text>
                <Text style={styles.tipText}>
                    These games are designed to help you manage stress through mindfulness,
                    focus, and relaxation techniques. Play for 5-10 minutes when feeling overwhelmed.
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
    header: {
        padding: 20,
        backgroundColor: colors.primary,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.textInverse,
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 15,
        color: colors.textInverse,
        opacity: 0.9,
    },
    gameCard: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginVertical: 8,
        padding: 16,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameInfo: {
        flex: 1,
        marginLeft: 16,
    },
    gameTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 6,
    },
    gameDescription: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: 12,
    },
    playButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    playText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.primary,
        marginRight: 6,
    },
    tipCard: {
        margin: 16,
        padding: 20,
        backgroundColor: colors.surface,
    },
    tipTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 8,
        marginBottom: 8,
    },
    tipText: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
    },
});

export default GamesScreen;
