import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(true); // Default to dark mode

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme !== null) {
                setIsDark(savedTheme === 'dark');
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        }
    };

    const toggleTheme = async () => {
        try {
            const newTheme = !isDark;
            setIsDark(newTheme);
            await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const theme = isDark ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme, theme }}>
            {children}
        </ThemeContext.Provider>
    );
};

const darkTheme = {
    primary: '#1E6EF4',
    primaryHover: '#4A8BFF',
    primaryActive: '#1557C7',
    accent: '#AF52DE',
    accentHover: '#C46EE8',
    bgDark: '#1C1C1E',
    surfaceDark: '#2C2C2E',
    surfaceElevated: '#3A3A3C',
    white: '#FFFFFF',
    text: '#FFFFFF',
    textSecondary: '#A1A1A6',
    error: '#FF453A',
    success: '#32D74B',
    isDark: true,
};

const lightTheme = {
    primary: '#1E6EF4',
    primaryHover: '#4A8BFF',
    primaryActive: '#1557C7',
    accent: '#AF52DE',
    accentHover: '#C46EE8',
    bgDark: '#F2F2F7',
    surfaceDark: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    white: '#FFFFFF',
    text: '#000000',
    textSecondary: '#6E6E73',
    error: '#FF3B30',
    success: '#34C759',
    isDark: false,
};
