import axios from "axios"
import getAuthHeader from '../interceptors/authHeader';

// Set the base URL for the API requests
const API_BASE_URL = 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_BASE_URL
});

// Add a request interceptor to include the authorization header in every request
api.interceptors.request.use(async (config) => {
    const authHeader = await getAuthHeader();
    config.headers = {
        ...config.headers,  // Include existing headers
        ...authHeader       // Add the authorization header
    };
    return config;
}, (error) => {
    return Promise.reject(error);
});


export default api;