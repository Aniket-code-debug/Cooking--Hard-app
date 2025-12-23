import client from './client';

export const getAllSuppliers = async () => {
    try {
        const response = await client.get('/api/suppliers');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSupplierById = async (id) => {
    try {
        const response = await client.get(`/api/suppliers/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createSupplier = async (data) => {
    try {
        const response = await client.post('/api/suppliers', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateSupplier = async (id, data) => {
    try {
        const response = await client.put(`/api/suppliers/${id}`, data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteSupplier = async (id) => {
    try {
        const response = await client.delete(`/api/suppliers/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
