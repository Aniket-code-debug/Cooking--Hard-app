import client from './client';

export const getAllPurchases = async () => {
    try {
        const response = await client.get('/api/purchases');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createPurchase = async (data) => {
    try {
        const response = await client.post('/api/purchases', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
