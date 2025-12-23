import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../../utils/constants';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const DashboardScreen = () => {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.subtitle}>Welcome, {user?.shopName || 'User'}!</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>🏪 Shop Details</Text>
                    <Text style={styles.cardText}>Shop: {user?.shopName}</Text>
                    <Text style={styles.cardText}>Email: {user?.email}</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>📱 Mobile App</Text>
                    <Text style={styles.cardText}>
                        This is your Vyapix mobile dashboard. Additional features will be added soon.
                    </Text>
                </View>

                <Button
                    title="Logout"
                    onPress={handleLogout}
                    variant="secondary"
                    style={styles.logoutButton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.bgDark,
    },
    header: {
        padding: 24,
        paddingTop: 60,
        backgroundColor: COLORS.surfaceDark,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    card: {
        backgroundColor: COLORS.surfaceElevated,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.text,
        marginBottom: 12,
    },
    cardText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    logoutButton: {
        marginTop: 24,
    },
});

export default DashboardScreen;
