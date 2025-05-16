import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        if (!response.data.token) {
            throw new Error('שרת לא החזיר טוקן תקין');
        }
        await AsyncStorage.setItem('userToken', response.data.token);
        return response.data.token;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'אימייל או סיסמה שגויים';
        throw new Error(errorMessage);
    }
};

const signup = async (name, email, password) => {
    try {
        const response = await api.post('/auth/signup', { name, email, password });

        console.log("Signup Response:", response.data); 

        if (response.data.success === false) { 
            throw new Error(response.data.message || 'שגיאה בהרשמה');
        }

        return response.data;
    } catch (error) {
        console.log("Signup Error:", error);
        const errorMessage = error.response?.data?.message || 'שגיאה בהרשמה';
        throw new Error(errorMessage);
    }
};

export default { login, signup };