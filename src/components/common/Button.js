import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS } from '../../utils/constants';

const Button = ({
    title,
    onPress,
    loading = false,
    disabled = false,
    variant = 'primary',
    style
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
                isDisabled && styles.disabledButton,
                style,
            ]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={COLORS.white} />
            ) : (
                <Text style={[
                    styles.buttonText,
                    variant === 'secondary' && styles.secondaryButtonText,
                ]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    secondaryButton: {
        backgroundColor: COLORS.surfaceElevated,
        borderWidth: 1,
        borderColor: COLORS.textSecondary,
    },
    disabledButton: {
        opacity: 0.5,
    },
    buttonText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButtonText: {
        color: COLORS.textSecondary,
    },
});

export default Button;
