import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from '../screens/main/DashboardScreen';
import InventoryScreen from '../screens/main/InventoryScreen';
import SuppliersScreen from '../screens/main/SuppliersScreen';
import PurchasesScreen from '../screens/main/PurchasesScreen';
import SalesScreen from '../screens/main/SalesScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import { useTheme } from '../context/ThemeContext';

const Drawer = createDrawerNavigator();

const MainDrawer = () => {
    const { theme } = useTheme();

    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: true,
                drawerStyle: {
                    backgroundColor: theme.surfaceDark,
                },
                drawerActiveBackgroundColor: theme.primary,
                drawerActiveTintColor: theme.white,
                drawerInactiveTintColor: theme.textSecondary,
                headerStyle: {
                    backgroundColor: theme.surfaceDark,
                },
                headerTintColor: theme.primary,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                drawerLabelStyle: {
                    fontSize: 16,
                    fontWeight: '500',
                },
            }}
        >
            <Drawer.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    drawerLabel: 'Home',
                    drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text>,
                    title: 'Vyapix',
                }}
            />
            <Drawer.Screen
                name="Inventory"
                component={InventoryScreen}
                options={{
                    drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📦</Text>,
                }}
            />
            <Drawer.Screen
                name="Suppliers"
                component={SuppliersScreen}
                options={{
                    drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏭</Text>,
                }}
            />
            <Drawer.Screen
                name="Purchases"
                component={PurchasesScreen}
                options={{
                    drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📥</Text>,
                }}
            />
            <Drawer.Screen
                name="Sales"
                component={SalesScreen}
                options={{
                    drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💰</Text>,
                }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{
                    drawerIcon: ({ color }) => <Text style={{ fontSize: 20 }}>⚙️</Text>,
                }}
            />
        </Drawer.Navigator>
    );
};

export default MainDrawer;
