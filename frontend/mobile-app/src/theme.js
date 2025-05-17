import { DefaultTheme } from "react-native-paper";
import { StyleSheet } from 'react-native';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#FFFFFF",
    primary: "#21aade",
    text: "#000000",
  },
  styles: StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "flex-start",
      padding: 20,
      writingDirection: "rtl",
      marginTop: 80,
      alignSelf: "center",
      width: "100%",
    },
    errorText: {
      color: "red",
      fontSize: 14,
      textAlign: "center",
      marginTop: 10,
    },
    tableHeader: {
      backgroundColor: "#FFD700",
      fontWeight: "bold",
      writingDirection: "rtl",
    },
    tableCell: {
      textAlign: "right", // יישור לימין
      writingDirection: "rtl", // כיוון ימין-לשמאל לתאים
    },
    tableRow: {
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      writingDirection: "rtl",
    },
    button: {
      backgroundColor: "#FFD700",
      borderRadius: 5,
      padding: 10,
      alignSelf: "center",
      marginTop: 20,
    },
    // ✅ הוספת סטיילים ל-dropdown
    dropdownContainer: {
      position: "absolute",
      right: 10,
      top: 50,
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 5, // 🔹 עבור אנדרואיד
    },
    userIcon: {
      fontSize: 32, // ✅ הגדלה של האייקון
      color: "black",
    },
    logoutButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    logoutText: {
      fontSize: 18,
      color: "#333",
      fontWeight: "bold",
    },
  }),
};

export default theme;