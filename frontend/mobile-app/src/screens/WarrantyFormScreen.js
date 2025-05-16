import React, { useState, useContext ,useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import warrantyService from '../services/warrantyService';
import { Platform, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; 
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { validateFields, validationRules } from '../utils/validators';
import FloatingButton from '../components/FloatingButton';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FileUpload from "../components/FileUpload";
import theme from "../theme";

const WarrantyFormScreen = () => {
    const { userToken } = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        if (!userToken) {
            navigation.replace('Login');
        }
    }, [userToken]);

    const [formData, setFormData] = useState({
        clientName: '',
        productInfo: '',
        installationDate: '',
        invoiceUpload: null,
    });

    const [installationDate, setInstallationDate] = useState('');
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);


    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // שינוי ערכים בטופס
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prevErrors) => ({ ...prevErrors, [field]: null }));//clean errors
    };

    // בחירת תאריך התקנה
    const handleConfirm = (date) => {
        const formattedDate = date.toISOString().split("T")[0];
    
        setInstallationDate(formattedDate);
        setFormData((prev) => ({ ...prev, installationDate: formattedDate })); // ✅ עדכון `formData`
        hideDatePicker();
        setErrors((prevErrors) => ({ ...prevErrors, installationDate: null }));
    };
    
    
    // וולידציה לשדות בטופס
    const handleSubmit = async () => {
        setErrors({});
    
        const validationRulesForForm = {
            clientName: validationRules.required,
            productInfo: validationRules.required,
            installationDate: validationRules.date,
            invoiceUpload: validationRules.file,
        };
    
        let newErrors = validateFields(formData, validationRulesForForm) || {}; // ✅ וודא שהערך הוא תמיד אובייקט
        console.log("שגיאות חדשות:", newErrors);
    
        setErrors(newErrors);
    
        if (Object.keys(newErrors).length > 0) return; // ✅ עכשיו לא יקרוס אם אין שגיאות
    
        try {
            setLoading(true);
    
            const warrantyData = new FormData();
            warrantyData.append("clientName", formData.clientName);
            warrantyData.append("productInfo", formData.productInfo);
            warrantyData.append("installationDate", formData.installationDate);
            
            //In web applications, the file must be converted to a Blob, as Base64 is text and not an actual file
            //In mobile applications, the uri can be sent directly since it correctly points to the file's location on the device
            if (formData.invoiceUpload) {
                if (Platform.OS === "web") {
                    const blob = await fetch(formData.invoiceUpload.uri).then(res => res.blob());
                    warrantyData.append("invoice", blob, formData.invoiceUpload.name); // send a real file
                } else {
                    warrantyData.append("invoice", {
                        uri: formData.invoiceUpload.uri,
                        type: formData.invoiceUpload.type,
                        name: formData.invoiceUpload.name,
                    });
                }
            }
            
    
            await warrantyService.createWarranty(warrantyData);
            navigation.navigate("WarrantyList");
        } catch (error) {
            setErrors({ submitError: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        // <SwipeGestureLayout screen="WarrantyForm">
        <>
            <View style={styles.container}>
                <TextInput
                    placeholder="שם לקוח"
                    value={formData.clientName}
                    onChangeText={(value) => handleChange('clientName', value)}
                    style={styles.input}
                />
                {errors.clientName && <Text style={styles.errorText}>{errors.clientName}</Text>}

                <TextInput
                    placeholder="מוצר"
                    value={formData.productInfo}
                    onChangeText={(value) => handleChange('productInfo', value)}
                    style={styles.input}
                />
                {errors.productInfo && <Text style={styles.errorText}>{errors.productInfo}</Text>}

                {Platform.OS === "web" ? (
                    <input
                        type="date"
                        value={installationDate}
                        onChange={(e) => {
                            setInstallationDate(e.target.value);
                            setFormData((prev) => ({ ...prev, installationDate: e.target.value }));
                            setErrors((prevErrors) => ({ ...prevErrors, installationDate: null }));
                        }}
                        style={styles.dateInputWeb} // ✅ שימוש בסטייל לשדה התאריך ב-Web
                    />
                ) : (
                    <>
                        <TouchableOpacity onPress={showDatePicker} style={styles.datePickerContainer}>
                            <MaterialIcons name="calendar-today" size={28} color="black" />
                            <Text style={styles.dateText}>
                                {installationDate ? installationDate : "בחר תאריך"}
                            </Text>
                        </TouchableOpacity>


                        <DateTimePickerModal
                            isVisible={isDatePickerVisible}
                            mode="date"
                            onConfirm={handleConfirm}
                            onCancel={hideDatePicker}
                        />
                    </>
                )}

                {errors.installationDate && <Text style={styles.errorText}>{errors.installationDate}</Text>}

                {/* using the fileUplod component */}
                <FileUpload formData={formData} setFormData={setFormData} setErrors={setErrors}/>
                {errors.invoiceUpload && <Text style={styles.errorText}>{errors.invoiceUpload}</Text>}
                

                <Button mode="contained" onPress={handleSubmit} loading={loading} style={styles.submitButton}>
                    שמירת אחריות
                </Button>
                {errors.submitError && <Text style={styles.errorText}>{errors.submitError}</Text>}
            
                
            </View>
            <FloatingButton title="לרשימת האחריות" onPress={() => navigation.navigate("WarrantyList")} />
        </>
        // </SwipeGestureLayout>
    );
};

const styles = StyleSheet.create({
    ...theme.styles,
    input: { 
        marginBottom: 10,
        textAlign: "right", // טקסט ייכתב מימין לשמאל 
        alignSelf: "stretch", // הקלט יתפרס לרוחב הטופס
    },
    fileName: { fontSize: 14, marginBottom: 5 },
    iconButton: {backgroundColor: '#f0f0f0',padding: 10,borderRadius: 5,alignSelf: 'center',marginVertical: 10},
    submitButton: {
        width: "100%", // הכפתור יתפרש על כל הרוחב
        alignSelf: "center", // מרכז את הכפתור
        marginTop: 20, // ריווח בין הכפתור להעלאה לבין הכפתור הזה
    },
    // ✅ עיצוב לשדה התאריך ב-Web
    dateInputWeb: {
        width: "50%", // ✅ רוחב מוקטן ב-Web
        padding: 10,
        fontSize: 16,
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 8,
        backgroundColor: "#f0f0f0",
        textAlign: "right",
        appearance: "none",
        display: "block", 
        marginLeft: "auto",
        marginRight: "auto"
    },
    // ✅ עיצוב לכפתור בחירת תאריך ב-Mobile
    datePickerContainer: {
        width: "50%", // ✅ רק הרוחב מצטמצם ל-50%
        paddingVertical: 12, 
        paddingHorizontal: 15, 
        borderWidth: 1, 
        borderColor: "#aaa", 
        borderRadius: 8, 
        backgroundColor: "#f0f0f0", 
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    dateText: {
        fontSize: 18,
        color: "#333",
        fontWeight: "bold",
        marginLeft: 10, // מרווח מהאייקון
    },

});

export default WarrantyFormScreen;