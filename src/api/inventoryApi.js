import client from './client';

/**
 * Get all inventory items (products)
 * @returns {Promise<Array>}
 */
export const getAllInventory = async () => {
    try {
        const response = await client.get('/api/inventory/products');
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Create new inventory item (product)
 * @param {object} data - {name, category, unit, minStockLevel, sellingPrice, costPrice, initialStock, etc.}
 * @returns {Promise<Object>}
 */
export const createInventory = async (data) => {
    try {
        const response = await client.post('/api/inventory/products', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Quick adjust stock (+1 or -1)
 * @param {string} productId
 * @param {number} change - +1 or -1
 * @returns {Promise<Object>}
 */
export const quickAdjustStock = async (productId, change) => {
    try {
        const response = await client.post('/api/inventory/quick-adjust', {
            productId,
            change,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get inventory alerts (low stock, expiring items)
 * @returns {Promise<Object>}
 */
export const getInventoryAlerts = async () => {
    try {
        const response = await client.get('/api/inventory/alerts');
        return response.data;
    } catch (error) {
        throw error;
    }
};
