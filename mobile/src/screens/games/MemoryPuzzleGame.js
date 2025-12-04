// Memory Puzzle Game
// Calming memory matching game
// Author: StressBuster Team

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../../constants/colors';
import { gameAPI } from '../../services/api';

const MemoryPuzzleGame = () => {
    const [cards, setCards] = useState([]);
    const [flippedIndices, setFlippedIndices] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [moves, setMoves] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [sessionStart, setSessionStart] = useState(null);

    const icons = ['heart', 'star', 'flower', 'leaf', 'moon', 'sunny', 'water', 'flame'];

    useEffect(() => {
        if (flippedIndices.length === 2) {
            checkMatch();
        }
    }, [flippedIndices]);

    useEffect(() => {
        if (matchedPairs.length === icons.length && isActive) {
            endGame();
        }
    }, [matchedPairs]);

    const initializeGame = () => {
        // Create pairs of cards
        const cardPairs = [...icons, ...icons]
            .map((icon, index) => ({ id: index, icon, matched: false }))
            .sort(() => Math.random() - 0.5);

        setCards(cardPairs);
        setFlippedIndices([]);
        setMatchedPairs([]);
        setMoves(0);
        setIsActive(true);
        setSessionStart(Date.now());
    };

    const checkMatch = () => {
        const [first, second] = flippedIndices;

        if (cards[first].icon === cards[second].icon) {
            setMatchedPairs(prev => [...prev, cards[first].icon]);
        }

        setTimeout(() => {
            setFlippedIndices([]);
            setMoves(prev => prev + 1);
        }, 1000);
    };

    const handleCardPress = (index) => {
        if (!isActive || flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(cards[index].icon)) {
            return;
        }

        setFlippedIndices(prev => [...prev, index]);
    };

    const endGame = async () => {
        setIsActive(false);

        if (sessionStart) {
            const duration = Math.floor((Date.now() - sessionStart) / 1000);
            const score = Math.max(0, 100 - moves);

            try {
                await gameAPI.saveSession({
                    gameType: 'memory_puzzle',
                    durationSeconds: duration,
                    score: score,
                    completed: true,
                });
            } catch (error) {
                console.error('Error saving session:', error);
            }
        }
    };

    const renderCard = ({ item, index }) => {
        const isFlipped = flippedIndices.includes(index) || matchedPairs.includes(item.icon);

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    isFlipped && styles.cardFlipped,
                    matchedPairs.includes(item.icon) && styles.cardMatched,
                ]}
                onPress={() => handleCardPress(index)}
                activeOpacity={0.8}
            >
                {isFlipped ? (
                    <Icon name={item.icon} size={32} color={colors.textInverse} />
                ) : (
                    <Icon name="help" size={32} color={colors.textSecondary} />
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Memory Puzzle</Text>
                <Text style={styles.moves}>Moves: {moves}</Text>
            </View>

            {!isActive && cards.length === 0 ? (
                <View style={styles.startContainer}>
                    <Text style={styles.instruction}>
                        Match all pairs of calming icons to complete the puzzle
                    </Text>
                    <TouchableOpacity style={styles.startButton} onPress={initializeGame}>
                        <Text style={styles.startButtonText}>Start Game</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cards}
                        renderItem={renderCard}
                        keyExtractor={item => item.id.toString()}
                        numColumns={4}
                        contentContainerStyle={styles.grid}
                    />

                    {matchedPairs.length === icons.length && (
                        <View style={styles.completionMessage}>
                            <Icon name="checkmark-circle" size={48} color={colors.success} />
                            <Text style={styles.completionText}>Puzzle Complete!</Text>
                            <Text style={styles.completionSubtext}>Moves: {moves}</Text>
                            <TouchableOpacity style={styles.playAgainButton} onPress={initializeGame}>
                                <Text style={styles.playAgainText}>Play Again</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    moves: {
        fontSize: 18,
        color: colors.textSecondary,
    },
    startContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    instruction: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 24,
    },
    startButton: {
        backgroundColor: colors.primary,
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 12,
    },
    startButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textInverse,
    },
    grid: {
        justifyContent: 'center',
    },
    card: {
        width: 70,
        height: 70,
        margin: 6,
        backgroundColor: colors.surface,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardFlipped: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    cardMatched: {
        backgroundColor: colors.memoryMatch,
        borderColor: colors.memoryMatch,
    },
    completionMessage: {
        position: 'absolute',
        top: '40%',
        left: '10%',
        right: '10%',
        backgroundColor: colors.surface,
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    completionText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
        marginTop: 16,
    },
    completionSubtext: {
        fontSize: 16,
        color: colors.textSecondary,
        marginTop: 8,
    },
    playAgainButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 12,
        marginTop: 20,
    },
    playAgainText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.textInverse,
    },
});

export default MemoryPuzzleGame;
