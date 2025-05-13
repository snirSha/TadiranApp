import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { Provider } from 'react-native-paper';
import theme from "./src/theme";

export default function App() {
  return (
    <AuthProvider>
      <Provider theme={theme}>
        <NavigationContainer>
            <StatusBar barStyle="dark-content" />
            <AppNavigator />
        </NavigationContainer>
      </Provider>
    </AuthProvider>
  );
}

