import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import WarrantyFormScreen from '../screens/WarrantyFormScreen';
import WarrantyListScreen from '../screens/WarrantyListScreen';
import tadiranLogo from "../assets/tadiranLogo.png";
import { Image } from "react-native";
import UserMenu from "../components/userMenu";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();


const AppNavigation = () => {
    
    return (
            <Stack.Navigator 
                initialRouteName="Login"
                screenOptions={({ route }) => ({
                    headerStyle: { backgroundColor: "#21aade" }, 
                    headerTitleAlign: "center",
                    headerTitleStyle: { fontSize: 24, fontWeight: "bold", color: "#000" },
                
                    headerLeft: () => (
                        <Image 
                            source={tadiranLogo} 
                            style={{ width: 50, height: 50, marginLeft: 10, borderRadius: 25, overflow: "hidden" }} 
                        />
                    ),
                    headerRight: () => <UserMenu routeName={route.name}/>
                })}
            >
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerTitle: "התחברות" }} />
                <Stack.Screen name="Signup" component={SignUpScreen} options={{ headerTitle: "הרשמה" }} />
                <Stack.Screen name="WarrantyForm" component={WarrantyFormScreen} options={{ headerTitle: "טופס אחריות" }} />
                <Stack.Screen name="WarrantyList" component={WarrantyListScreen} options={{ headerTitle: "רשימת אחריות" }} />
            </Stack.Navigator>
    );
};

export default AppNavigation;