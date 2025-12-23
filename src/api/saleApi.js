import client from './client';

export const getAllSales = async () => {
    try {
        const response = await client.get('/api/sales');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createSale = async (data) => {
    try {
        const response = await client.post('/api/sales', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
