import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';

const SignUpScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignup = async (formData) => {
        try {
            setLoading(true);
            await authService.signup(formData.name, formData.email, formData.password);
            navigation.navigate('Login');
        } catch (error) {
            setErrorMessage(error.message);
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <AuthForm mode="signup" onSubmit={handleSignup} loading={loading} />

            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: 'blue', textAlign: 'center', marginTop: 20 }}>
                    יש לך חשבון? להתחבר
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20},
    errorText: { color: 'red', fontSize: 14, textAlign: 'center', marginTop: 10 },
});

export default SignUpScreen;