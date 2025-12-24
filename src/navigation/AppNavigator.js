import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthStack from './AuthStack';
import MainDrawer from './MainDrawer';
import LoadingSpinner from '../components/common/LoadingSpinner';

const AppNavigator = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <MainDrawer /> : <AuthStack />}
        </NavigationContainer>
    );
};

export default AppNavigator;
