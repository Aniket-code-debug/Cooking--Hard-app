import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const SettingsScreen = () => {
    const { theme, isDark, toggleTheme } = useTheme();
    const { user, logout } = useAuth();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.bgDark }]}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: theme.primary }]}>Settings</Text>
            </View>

            {/* User Info Section */}
            <View style={[styles.section, { backgroundColor: theme.surfaceDark }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>
                <View style={styles.infoRow}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Shop Name</Text>
                    <Text style={[styles.value, { color: theme.text }]}>{user?.shopName || 'N/A'}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Email</Text>
                    <Text style={[styles.value, { color: theme.text }]}>{user?.email || 'N/A'}</Text>
                </View>
            </View>

            {/* Appearance Section */}
            <View style={[styles.section, { backgroundColor: theme.surfaceDark }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
                        <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>
                            {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
                        </Text>
                    </View>
                    <Switch
                        value={isDark}
                        onValueChange={toggleTheme}
                        trackColor={{ false: theme.textSecondary, true: theme.primary }}
                        thumbColor={theme.white}
                    />
                </View>
            </View>

            {/* App Info Section */}
            <View style={[styles.section, { backgroundColor: theme.surfaceDark }]}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>App Info</Text>
                <View style={styles.infoRow}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Version</Text>
                    <Text style={[styles.value, { color: theme.text }]}>1.0.0</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={[styles.label, { color: theme.textSecondary }]}>Platform</Text>
                    <Text style={[styles.value, { color: theme.text }]}>React Native + Expo</Text>
                </View>
            </View>

            {/* Logout Button */}
            <Pressable
                style={[styles.logoutButton, { backgroundColor: theme.error }]}
                onPress={logout}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 60,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    section: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    label: {
        fontSize: 14,
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    settingInfo: {
        flex: 1,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    settingDescription: {
        fontSize: 12,
    },
    logoutButton: {
        margin: 16,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    logoutText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SettingsScreen;
