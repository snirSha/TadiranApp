import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';

const LoginScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = async (formData) => {
        try {
            setLoading(true);
            await authService.login(formData.email, formData.password);
            navigation.navigate('WarrantyForm');
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

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    errorText: { color: 'red', fontSize: 14, textAlign: 'center', marginTop: 10 },
});

export default LoginScreen;