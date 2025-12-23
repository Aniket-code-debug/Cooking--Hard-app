import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS } from '../../utils/constants';

const Card = ({ children, onPress, style }) => {
    const Component = onPress ? Pressable : View;

    return (
        <Component
            style={[styles.card, style]}
            onPress={onPress}
            android_ripple={{ color: COLORS.surfaceDark }}
        >
            {children}
        </Component>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.surfaceElevated,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});

export default Card;
