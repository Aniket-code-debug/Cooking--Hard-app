import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from './constants';

// Token management
export const storeToken = async (token) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
        console.error('Error storing token:', error);
        throw error;
    }
};

export const getToken = async () => {
    try {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        return token;
    } catch (error) {
        console.error('Error getting token:', error);
        return null;
    }
};

export const removeToken = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    } catch (error) {
        console.error('Error removing token:', error);
        throw error;
    }
};

// User management
export const storeUser = async (user) => {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
        console.error('Error storing user:', error);
        throw error;
    }
};

export const getUser = async () => {
    try {
        const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
};

export const removeUser = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    } catch (error) {
        console.error('Error removing user:', error);
        throw error;
    }
};

// Clear all data (logout)
export const clearStorage = async () => {
    try {
        await Promise.all([removeToken(), removeUser()]);
    } catch (error) {
        console.error('Error clearing storage:', error);
        throw error;
    }
};
