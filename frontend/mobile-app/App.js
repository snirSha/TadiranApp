import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
        <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
        </NavigationContainer>
    </AuthProvider>
  );
}

