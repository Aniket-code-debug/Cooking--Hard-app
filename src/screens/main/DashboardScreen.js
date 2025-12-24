import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Button from '../../components/common/Button';

const DashboardScreen = () => {
    const { user, logout } = useAuth();
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.bgDark }]}>
            <View style={[styles.content, { backgroundColor: theme.surfaceDark }]}>
                <Text style={[styles.welcome, { color: theme.primary }]}>
                    Welcome back!
                </Text>
                <Text style={[styles.shopName, { color: theme.text }]}>
                    {user?.shopName || 'Shop Owner'}
                </Text>
                <Text style={[styles.email, { color: theme.textSecondary }]}>
                    {user?.email}
                </Text>

                <View style={styles.menu}>
                    <Text style={[styles.menuTitle, { color: theme.text }]}>
                        Quick Actions
                    </Text>
                    <Text style={[styles.menuItem, { color: theme.textSecondary }]}>
                        📦 Manage your inventory
                    </Text>
                    <Text style={[styles.menuItem, { color: theme.textSecondary }]}>
                        🏭 Add suppliers
                    </Text>
                    <Text style={[styles.menuItem, { color: theme.textSecondary }]}>
                        📥 Record purchases
                    </Text>
                    <Text style={[styles.menuItem, { color: theme.textSecondary }]}>
                        💰 Make sales
                    </Text>
                    <Text style={[styles.menuItem, { color: theme.textSecondary }]}>
                        ⚙️ Configure settings
                    </Text>
                </View>

                <Text style={[styles.hint, { color: theme.textSecondary }]}>
                    Tap the ☰ menu button to navigate
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    content: {
        flex: 1,
        padding: 24,
        borderRadius: 12,
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    shopName: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    email: {
        fontSize: 14,
        marginBottom: 32,
    },
    menu: {
        marginTop: 24,
    },
    menuTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 16,
    },
    menuItem: {
        fontSize: 16,
        marginBottom: 12,
        paddingLeft: 8,
    },
    hint: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 'auto',
        fontStyle: 'italic',
    },
});

export default DashboardScreen;
