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
      justifyContent: "flex-start", // ✅ מתחיל מהחלק העליון
      padding: 20,
      writingDirection: "rtl", // 🔹 תמיכה בעברית
      marginTop: 40,
      alignSelf: "center",
      width: "85%"
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
    },
    tableRow: {
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    button: {
      backgroundColor: "#FFD700",
      borderRadius: 5,
      padding: 10,
      alignSelf: "center",
      marginTop: 20,
    },
  }),

};

export default theme;