// Button Component
// Reusable button component with different variants
// Author: StressBuster Team

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import colors from '../../constants/colors';

const Button = ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style = {},
    textStyle = {}
}) => {
    const buttonStyles = [
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style
    ];

    const textStyles = [
        styles.text,
        styles[`${variant}Text`],
        textStyle
    ];

    return (
        <TouchableOpacity
            style={buttonStyles}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
        >
            {loading ? (
                <ActivityIndicator color={variant === 'primary' ? colors.textInverse : colors.primary} />
            ) : (
                <Text style={textStyles}>{title}</Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.secondary,
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: colors.primary,
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
    },
    primaryText: {
        color: colors.textInverse,
    },
    secondaryText: {
        color: colors.textInverse,
    },
    outlineText: {
        color: colors.primary,
    },
    disabled: {
        opacity: 0.5,
    },
});

export default Button;
