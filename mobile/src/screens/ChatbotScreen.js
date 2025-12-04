// Chatbot Screen
// AI-guided conversation interface
// Author: StressBuster Team

import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import colors from '../constants/colors';
import { chatbotAPI } from '../services/api';
import { getChatSession, saveChatSession } from '../services/storage';

const ChatbotScreen = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [loading, setLoading] = useState(false);
    const [sessionId] = useState(`session_${Date.now()}`);
    const flatListRef = useRef(null);

    useEffect(() => {
        loadChatHistory();
        // Send welcome message
        if (messages.length === 0) {
            addMessage("Hi! I'm here to support you. How are you feeling today?", 'bot');
        }
    }, []);

    const loadChatHistory = async () => {
        const history = await getChatSession(sessionId);
        if (history.length > 0) {
            setMessages(history);
        }
    };

    const addMessage = (text, sender) => {
        const newMessage = {
            id: Date.now().toString(),
            text,
            sender,
            timestamp: new Date(),
        };
        setMessages(prev => {
            const updated = [...prev, newMessage];
            saveChatSession(sessionId, updated);
            return updated;
        });
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;

        const userMessage = inputText.trim();
        setInputText('');
        addMessage(userMessage, 'user');
        setLoading(true);

        try {
            const response = await chatbotAPI.sendMessage(userMessage, sessionId);
            addMessage(response.data.message, 'bot');
        } catch (error) {
            addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = ({ item }) => {
        const isBot = item.sender === 'bot';
        return (
            <View style={[styles.messageContainer, isBot ? styles.botMessage : styles.userMessage]}>
                <View style={[styles.messageBubble, isBot ? styles.botBubble : styles.userBubble]}>
                    <Text style={[styles.messageText, isBot ? styles.botText : styles.userText]}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={90}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type your message..."
                    placeholderTextColor={colors.textLight}
                    multiline
                    maxLength={500}
                />
                <TouchableOpacity
                    style={[styles.sendButton, (!inputText.trim() || loading) && styles.sendButtonDisabled]}
                    onPress={sendMessage}
                    disabled={!inputText.trim() || loading}
                >
                    <Icon name="send" size={24} color={colors.textInverse} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    messagesList: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 12,
    },
    botMessage: {
        alignItems: 'flex-start',
    },
    userMessage: {
        alignItems: 'flex-end',
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    botBubble: {
        backgroundColor: colors.surface,
        borderBottomLeftRadius: 4,
    },
    userBubble: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 20,
    },
    botText: {
        color: colors.text,
    },
    userText: {
        color: colors.textInverse,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        maxHeight: 100,
        fontSize: 16,
        color: colors.text,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});

export default ChatbotScreen;
