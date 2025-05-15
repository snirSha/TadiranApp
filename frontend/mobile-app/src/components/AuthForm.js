import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { validateFields, validationRules } from '../utils/validators';

const AuthForm = ({ mode, onSubmit, loading }) => {
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false); // For toggling password visibility

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // אם המשתמש מילא את השדה, הסר את השגיאה לגמרי
        setErrors((prev) => ({ ...prev, [field]: value.trim() ? null : prev[field] }));
    };

    const handleSubmit = () => {
        //to show errors if the user tries to submit without filling the form
        setTouched({ email: true, password: true, name: mode === 'signup' });

        const rules = { email: validationRules.email, password: validationRules.password };
        if (mode === 'signup') rules.name = validationRules.required;

        const newErrors = validateFields(formData, rules);
        setErrors(newErrors || {});

        if (newErrors) return;

        onSubmit(formData);
    };

    return (
        <View style={styles.container}>
            {mode === 'signup' && (
                <>
                    <TextInput
                        label="שם משתמש"
                        value={formData.name}
                        onChangeText={(value) => handleChange('name', value)}
                        style={styles.input}
                    />
                    {touched.name && errors.name && typeof errors.name === 'string' && errors.name !== '' &&
                    (
                    <Text style={styles.error}>{errors.name}</Text>
                    )}
                </>
            )}
            <TextInput
                label="אימייל"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                style={styles.input}
            />
            {touched.email && errors.email && errors.email !== null && errors.email.length > 0 && (
                <Text style={styles.error}>{errors.email}</Text>
            )}

            <TextInput
                label="סיסמה"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                secureTextEntry={!passwordVisible}
                right={
                    <TextInput.Icon 
                        icon={passwordVisible ? 'eye-off' : 'eye'}
                        onPress={() => setPasswordVisible(!passwordVisible)}
                    />
                }
                style={styles.input}
            />
            {touched.password && errors.password && typeof errors.password === 'string' && errors.password !== '' && 
            (
            <Text style={styles.error}>{errors.password}</Text>
            )}

            <Button mode="contained" onPress={handleSubmit} loading={loading}>
                {mode === 'signup' ? 'הרשמה' : 'התחבר'}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 20 },
    input: { marginBottom: 10 },
    error: { color: 'red', fontSize: 12, marginBottom: 10 },
});

export default AuthForm;