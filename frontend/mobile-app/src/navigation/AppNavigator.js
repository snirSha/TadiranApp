import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WarrantyFormScreen from '../screens/WarrantyFormScreen';
import WarrantyListScreen from '../screens/WarrantyListScreen';
import { AuthProvider } from '../context/AuthContext';

const Stack = createStackNavigator();

const AppNavigation = () => {
    return (
        <AuthProvider>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignUpScreen} />
                <Stack.Screen name="WarrantyForm" component={WarrantyFormScreen} />
                <Stack.Screen name="WarrantyList" component={WarrantyListScreen} />
            </Stack.Navigator>
        </AuthProvider>
    );
};

export default AppNavigation;