import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/main/DashboardScreen';
import InventoryScreen from '../screens/main/InventoryScreen';
import SuppliersScreen from '../screens/main/SuppliersScreen';
import PurchasesScreen from '../screens/main/PurchasesScreen';
import SalesScreen from '../screens/main/SalesScreen';
import { COLORS } from '../utils/constants';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: COLORS.surfaceDark,
                    borderTopColor: COLORS.surfaceElevated,
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: COLORS.primary,
                tabBarInactiveTintColor: COLORS.textSecondary,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏠</Text>,
                }}
            />
            <Tab.Screen
                name="Inventory"
                component={InventoryScreen}
                options={{
                    tabBarLabel: 'Inventory',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📦</Text>,
                }}
            />
            <Tab.Screen
                name="Suppliers"
                component={SuppliersScreen}
                options={{
                    tabBarLabel: 'Suppliers',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>🏭</Text>,
                }}
            />
            <Tab.Screen
                name="Purchases"
                component={PurchasesScreen}
                options={{
                    tabBarLabel: 'Purchases',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>📥</Text>,
                }}
            />
            <Tab.Screen
                name="Sales"
                component={SalesScreen}
                options={{
                    tabBarLabel: 'Sales',
                    tabBarIcon: ({ color }) => <Text style={{ fontSize: 20 }}>💰</Text>,
                }}
            />
        </Tab.Navigator>
    );
};

export default MainTabs;
