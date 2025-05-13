import AsyncStorage from "@react-native-async-storage/async-storage";

// This function retrieves the JWT token from AsyncStorage and adds it to the request headers
const getAuthHeader = async (config) => {
    if (!config || !config.url) {
        console.warn('אזהרה: `config` או `url` אינם מוגדרים', config);
        return {};
    }

    try {
        // רשימת נתיבים ציבוריים שלא דורשים טוקן
        const publicEndpoints = ['/auth/login', '/auth/signup'];

        // אם הנתיב נכלל ברשימה הציבורית, מחזירים אובייקט ריק
        if (publicEndpoints.some(endpoint => config.url.includes(endpoint))) {
            return {};
        }

        // אחרת, שולפים את ה-JWT ומוסיפים אותו לכותרת Authorization
        const token = await AsyncStorage.getItem('userToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
    } catch (error) {
        console.error('שגיאה בשליפת הטוקן:', error);
        return {};
    }
};

export default getAuthHeader;