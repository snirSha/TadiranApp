import AsyncStorage from "@react-native-async-storage/async-storage";

// This function retrieves the JWT token from AsyncStorage and adds it to the request headers
const getAuthHeader = async (config) => {
    if (!config || !config.url) {
        console.warn('אזהרה: `config` או `url` אינם מוגדרים', config);
        return {};
    }

    try {
        // no need token for these routes
        const publicEndpoints = ['/auth/login', '/auth/signup'];

        if (publicEndpoints.some(endpoint => config.url.includes(endpoint))) {
            return {};
        }

        // Otherwise, extract the JWT and add it to the authorization header
        const token = await AsyncStorage.getItem('userToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (error) {
        console.error('שגיאה בשליפת הטוקן:', error);
        return {};
    }
};

export default getAuthHeader;