import axios from "axios"
import getAuthHeader from '../interceptors/authHeader';

// Set the base URL for the API requests
// console.log('API URL:', process.env.EXPO_PUBLIC_API_URL);
const apiUrl = process.env.EXPO_PUBLIC_API_URL;//In prodction I will have to change it to some cloude servei like AWS

const api = axios.create({
    baseURL: apiUrl
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