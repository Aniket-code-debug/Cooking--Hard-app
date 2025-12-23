import React, { createContext, useState, useContext, useEffect } from 'react';
import { storeToken, getToken, removeToken, storeUser, getUser, clearStorage } from '../utils/storage';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Load stored auth data on app start
    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const [storedToken, storedUser] = await Promise.all([
                getToken(),
                getUser(),
            ]);

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(storedUser);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error('Error loading stored auth:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (userData, authToken) => {
        try {
            await Promise.all([
                storeToken(authToken),
                storeUser(userData),
            ]);

            setToken(authToken);
            setUser(userData);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Error in login:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await clearStorage();
            setToken(null);
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Error in logout:', error);
            throw error;
        }
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
