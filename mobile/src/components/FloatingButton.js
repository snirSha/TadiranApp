import { StyleSheet, TouchableOpacity, Text } from "react-native";

const FloatingButton = ({ onPress, title }) => {
    return (
        <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    floatingButton: {
        position: "absolute",
        top: 20,
        left: 20,
        backgroundColor: "#FFD700",
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.3)", 
        elevation: 5, 
    },
    buttonText: {
        color: "#000",
        fontSize: 16, 
        fontWeight: "bold",
        textAlign: "center", 
    },
});

export default FloatingButton;