import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            const token = await AsyncStorage.getItem('userToken');
            setUserToken(token);
        };
        loadToken();
    }, []);

    return (
        <AuthContext.Provider value={{ userToken }}>
            {children}
        </AuthContext.Provider>
    );
};