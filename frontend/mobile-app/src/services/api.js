import axios from "axios"
import getAuthHeader from '../interceptors/authHeader';

// Set the base URL for the API requests
const API_BASE_URL = 'http://192.168.1.157:4000/api';//In prodction I will have to change it to some cloude servei like AWS

const api = axios.create({
    baseURL: API_BASE_URL
});

// Add a request interceptor to include the authorization header in every request
api.interceptors.request.use(async (config) => {
    // console.log("config: ", config);
    const authHeader = await getAuthHeader(config);
    config.headers = {
        ...config.headers,  // Include existing headers
        ...authHeader ,
    };
    return config;
}, (error) => {
    return Promise.reject(error);
});


export default api;