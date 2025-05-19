import React, { useState } from 'react';
import { View, Text, TouchableOpacity} from 'react-native';
import AuthForm from '../components/AuthForm';
import authService from '../services/authService';
import theme from "../theme";
import { useNavigation } from "@react-navigation/native";

const SignUpScreen = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSignup = async (formData) => {
        try {
            setLoading(true);
    
            const response = await authService.signup(formData.name, formData.email, formData.password);
            // console.log("Signup Response:", response); // 
    
            if (response.success) {  
                navigation.navigate("Login");
            } else {
                console.log("Signup Failed:", response);
                setErrorMessage("הרשמה נכשלה, נסה שוב.");
            }
        } catch (error) {
            console.log("Signup Error:", error);
            setErrorMessage(error.message);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <View style={styles.container}>
            <AuthForm mode="signup" onSubmit={handleSignup} loading={loading} />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={{ color: 'blue', textAlign: 'center', marginTop: 20 }}>
                    יש לך חשבון? להתחבר
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = theme.styles;

export default SignUpScreen;