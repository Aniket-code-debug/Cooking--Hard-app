import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../utils/constants';

const FAB = ({ onPress, icon = '+', label }) => {
    return (
        <Pressable
            style={styles.fab}
            onPress={onPress}
            android_ripple={{ color: COLORS.primaryActive }}
        >
            <Text style={styles.icon}>{icon}</Text>
            {label && <Text style={styles.label}>{label}</Text>}
        </Pressable>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: COLORS.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
    },
    icon: {
        color: COLORS.white,
        fontSize: 24,
        fontWeight: 'bold',
    },
    label: {
        color: COLORS.white,
        fontSize: 10,
        marginTop: 2,
    },
});

export default FAB;
