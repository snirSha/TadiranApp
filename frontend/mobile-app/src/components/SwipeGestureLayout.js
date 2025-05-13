import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const SwipeGestureLayout = ({ children, screen }) => {
    const navigation = useNavigation();

    // swipeRight - navigate to the warranty list
    const swipeRight = Gesture.Pan().onEnd((event) => {
        if (event.translationX > 50 && screen === "WarrantyForm") {
            navigation.navigate("WarrantyList");
        }
    });
    // swipeLeft - navigate to the login screen or to the warranty form
    const swipeLeft = Gesture.Pan().onEnd((event) => {
        if (event.translationX < -50) {
            if (screen === "WarrantyForm") navigation.navigate("Login");
            if (screen === "WarrantyList") navigation.navigate("WarrantyForm");
        }
    });

    return (
        <GestureDetector gesture={Gesture.Exclusive(swipeRight, swipeLeft)}>
            <View style={styles.container}>
                {screen === "WarrantyForm" && <Text style={styles.arrowLeft}>⬅ להתחברות</Text>}
                {children}
                {screen === "WarrantyForm" && <Text style={styles.arrowRight}>לרשימת האחריות ➡</Text>}
                {screen === "WarrantyList" && <Text style={styles.arrowLeft}>⬅ להוספת אחריות</Text>}
            </View>
        </GestureDetector>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center" },
    arrowLeft: { position: "absolute", left: 10, fontSize: 16, color: "gray" },
    arrowRight: { position: "absolute", right: 10, fontSize: 16, color: "gray" },
});

export default SwipeGestureLayout;