import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../utils/constants';
import { getToken } from '../utils/storage';

// Create axios instance
const client = axios.create({
    baseURL: API_BASE_URL,
    timeout: API_TIMEOUT,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - attach JWT token
client.interceptors.request.use(
    async (config) => {
        try {
            const token = await getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error('Error getting token in interceptor:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
client.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle specific error cases
        if (error.response) {
            // Server responded with error status
            const { status, data } = error.response;

            if (status === 401) {
                // Unauthorized - token expired or invalid
                // Note: Logout will be handled by AuthContext
                console.log('Unauthorized request - token may be expired');
            } else if (status === 500) {
                console.error('Server error:', data?.message || 'Internal server error');
            }

            return Promise.reject(error);
        } else if (error.request) {
            // Request made but no response received
            console.error('Network error - no response received');
            return Promise.reject(new Error('Network error. Please check your connection.'));
        } else {
            // Something else happened
            console.error('Request error:', error.message);
            return Promise.reject(error);
        }
    }
);

export default client;
