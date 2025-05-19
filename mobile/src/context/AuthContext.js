import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(undefined);

    useEffect(() => {
        const loadToken = async () => {
            const token = await AsyncStorage.getItem('userToken');// using AsyncStorage for mobile apps
            setUserToken(token || null);
        };
        loadToken();
    }, []);

    return (
        <AuthContext.Provider value={{ userToken , setUserToken}}>
            {children}
        </AuthContext.Provider>
    );
};