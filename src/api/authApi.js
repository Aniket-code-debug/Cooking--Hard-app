import client from './client';

/**
 * Login user
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{token: string, user: {id: string, shopName: string, email: string}}>}
 */
export const login = async (email, password) => {
    try {
        const response = await client.post('/api/auth/login', { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Register new user
 * @param {object} userData - {shopName, ownerName, email, password, gstin, address, phone}
 * @returns {Promise<{message: string}>}
 */
export const register = async (userData) => {
    try {
        const response = await client.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};
