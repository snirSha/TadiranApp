import React from "react";
import { StyleSheet, View, Text, Alert, Image } from "react-native";
import { TextInput, Button } from 'react-native-paper';
import * as DocumentPicker from "expo-document-picker";
import { launchCamera } from "react-native-image-picker";
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

    const handleTakePhoto = async () => {
        try{
            const options = { mediaType: "photo", quality: 1 };
            const result = await launchCamera(options);
            if (!result.didCancel) {
                setFormData((prev) => ({ ...prev, invoiceUpload: result.assets[0] }));
            }
        }catch(error){
            setErrors((prevErrors) => ({ ...prevErrors, invoiceUpload: error.message }));
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