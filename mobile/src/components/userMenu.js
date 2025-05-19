import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import theme from "../theme"; // using theme.styles
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserMenu = ({ routeName }) => {
    const navigation = useNavigation();
    const route = useRoute();
    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleLogout = async () => {
        await AsyncStorage.removeItem("userToken");
        navigation.navigate("Login"); 
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("state", () => {
            setDropdownVisible(false); // closing menu
        });
        return unsubscribe;
    }, [navigation]);


    return (
        <View>
            {routeName === "WarrantyList" || routeName === "WarrantyForm" ? (
                <>
                    <TouchableOpacity onPress={() => setDropdownVisible(!isDropdownVisible)}>
                        <MaterialIcons name="person" style={theme.styles.userIcon} />
                    </TouchableOpacity>

                    {isDropdownVisible && (
                        <Modal transparent={true} animationType="fade">
                            <View style={theme.styles.dropdownContainer}>
                                <TouchableOpacity onPress={handleLogout} style={theme.styles.logoutButton}>
                                    <Text style={theme.styles.logoutText}>להתנתק</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    )}
                </>
            ) : null}
        </View>
    );
};

export default UserMenu;