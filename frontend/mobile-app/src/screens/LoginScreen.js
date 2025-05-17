import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';
import theme from "../theme";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { setUserToken } = useContext(AuthContext);

    const handleLogin = async (formData) => {
        try {
            setLoading(true);
            const token = await authService.login(formData.email, formData.password);
            console.log("Login Token:", token);

            if (token) {
                await AsyncStorage.setItem("userToken", token); 
                setUserToken(token); 
                console.log("✅ Navigating to WarrantyForm...");
                navigation.navigate("WarrantyForm");
            } else {
                setErrorMessage("שגיאה בהתחברות, נסה שוב.");
            }
    
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <AuthForm mode="login" onSubmit={handleLogin} loading={loading} />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={{ color: 'blue', textAlign: 'center', marginTop: 20 }}>
                    לא נרשמת? להרשמה
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = theme.styles;

export default LoginScreen;