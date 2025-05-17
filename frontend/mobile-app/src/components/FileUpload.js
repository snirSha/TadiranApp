import React from "react";
import { StyleSheet, View, Text, Alert, Image } from "react-native";
import { Button } from 'react-native-paper';
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { Platform } from "react-native";

const FileUpload = ({ formData, setFormData, setErrors }) => {

    const handleSelectFile = () => {
        if (Platform.OS === "web") {
            handleFileUpload(); // for web onlu file upload option
        } else {
            Alert.alert(
                "בחר אפשרות",
                "האם ברצונך לצלם תמונה או להעלות קובץ?",
                [
                    { text: "📷 צילום", onPress: handleTakePhoto },
                    { text: "📁 העלאה", onPress: handleFileUpload },
                    { text: "ביטול", style: "cancel" }
                ]
            );
        }
    };

    const requestCameraPermissions = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        console.log("🔍 Camera permission status:", status);

        if (status !== "granted") {
            alert("יש לאפשר גישה למצלמה כדי להעלות תמונות.");
            return false;
        }
        return true;
    };
    

    const handleTakePhoto = async () => {
        const hasPermission = await requestCameraPermissions();
        if (!hasPermission) return;
    
        console.log("📷 Opening camera...");
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        console.log("📸 Camera result:", result);
        if (!result.canceled) {
            setFormData((prev) => ({ ...prev, invoiceUpload: result.assets[0] }));
        }
    };

    

    const handleFileUpload = async () => {
        try {

            const file = await DocumentPicker.getDocumentAsync({ type: ["image/*", "application/pdf"] });

            if (!file || file.canceled ) {
                setErrors((prevErrors) => ({ ...prevErrors, invoiceUpload: "חובה להעלות קובץ." }));
                return;
            }
            
            const selectedFile = file.assets?.[0];
            if (!selectedFile) {
                console.error("שגיאה: לא נמצא קובץ בתוך `assets`");
                setErrors((prevErrors) => ({ ...prevErrors, invoiceUpload: "שגיאה: קובץ לא נמצא." }));
                return;
            }
       

            const fileData = {
                uri: selectedFile.uri || null, // ✅ אם זה תמונה, שמור `uri`
                name: selectedFile.name, // ✅ שם הקובץ 
                type: selectedFile.mimeType || "application/octet-stream", // ✅ סוג הקובץ 
            };
            // ✅ המרת `base64` לקובץ בפלאפון
            if (Platform.OS !== "web" && fileData.uri.startsWith("data:image")) {
                const base64Data = fileData.uri.split(",")[1]; // מחיקת החלק 'data:image/jpeg;base64,'
                const filePath = `${FileSystem.cacheDirectory}${fileData.name}`;

                await FileSystem.writeAsStringAsync(filePath, base64Data, {
                    encoding: FileSystem.EncodingType.Base64,
                });

                fileData.uri = filePath; // עדכון הנתיב החדש
            }

            setFormData((prev) => ({ ...prev, invoiceUpload: fileData }));
    
            setErrors((prevErrors) => ({ ...prevErrors, invoiceUpload: null })); // ניקוי שגיאה אחרי בחירת קובץ
        } catch (error) {
            setErrors((prevErrors) => ({ ...prevErrors, invoiceUpload: error.message }));
        }
    };

    const handleCancelFile = () => {
        setFormData((prev) => ({ ...prev, invoiceUpload: null }));
    };

    return (
        <View style={styles.uploadButtonWrapper}>
            <Button mode="contained" onPress={handleSelectFile}  style={styles.uploadButton}>העלאת חשבונית</Button>
        {/* <Button mode="contained" onPress={handleSubmit} loading={loading} style={styles.submitButton}>שלח אחריות</Button> */}
    
        {formData.invoiceUpload && (
            <View style={styles.filePreview}>
                {formData.invoiceUpload.type.startsWith("image/") ? (
                    <Image source={{ uri: formData.invoiceUpload.uri }} style={styles.imagePreview} />
                ) : (
                    <Text style={styles.fileName}>📄 {formData.invoiceUpload.name}</Text> // pdf
                )}
                <Button mode="text" onPress={handleCancelFile}> ביטול </Button>

            </View>
        )}

        </View>
    );
};

const styles = StyleSheet.create({
    filePreview: { 
        marginTop: 5, // ✅ מקטין את המרווח
        marginBottom: 5, // ✅ מקטין את המרווח
        alignItems: "center", 
    },
    fileName: { fontSize: 14, marginBottom: 5 },
    imagePreview: { width: 150, height: 150, marginBottom: 10 },
    uploadButton: {
        backgroundColor: "#6200ee",
        paddingVertical: 8, // ✅ הקטנת ה-padding כדי להפחית את הגובה
        paddingHorizontal: 1, // ✅ הקטנת הרוחב הפנימי
        borderRadius: 30,
        alignSelf: "center", // ✅ מרכז את הכפתור
        marginTop: 10,
    },

});


export default FileUpload;