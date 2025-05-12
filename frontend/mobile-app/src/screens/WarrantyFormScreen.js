import React, { useState, useContext } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import warrantyService from '../services/warrantyService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { validateFields, validationRules } from '../utils/validators';
import SwipeGestureLayout from '../components/SwipeGestureLayout';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

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
        installationDate: new Date().toISOString().split('T')[0], //today's date as default
        invoiceUpload: null,
    });

    const [showPicker, setShowPicker] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // שינוי ערכים בטופס
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // בחירת תאריך התקנה
    const handleDateChange = (event, selectedDate) => {
        setShowPicker(false);
        if (selectedDate) {
            setFormData((prev) => ({ ...prev, installationDate: selectedDate.toISOString().split('T')[0] }));
        }
    };

    // user can take a photo of the recipt
    const handleTakePhoto = async () => {
        const options = { mediaType: 'photo', quality: 1 };
        const result = await launchCamera(options);

        if (!result.didCancel) {
            setFormData((prev) => ({ ...prev, invoiceUpload: result.assets[0] }));
        }
    };

    // העלאת חשבונית (תמונה או PDF)
    const handleFileUpload = async () => {
        try {
            const file = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'], // מאפשר לבחור תמונות ו-PDF
            });
    
            if (file.type !== 'cancel') { // בודק שהמשתמש לא ביטל את הבחירה
                setFormData((prev) => ({ ...prev, invoiceUpload: file }));
            }
        } catch (error) {
            console.warn('שגיאה בבחירת קובץ:', error);
        }
    };
    

    // ביטול הקובץ שהועלה
    const handleCancelFile = () => {
        setFormData((prev) => ({ ...prev, invoiceUpload: null }));
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

        const newErrors = validateFields(formData, validationRulesForForm);
        setErrors(newErrors || {});
        if (newErrors) return;

        try {
            setLoading(true);

            // שליחת הנתונים בפורמט `multipart/form-data`
            const warrantyData = new FormData();
            warrantyData.append('clientName', formData.clientName);
            warrantyData.append('productInfo', formData.productInfo);
            warrantyData.append('installationDate', formData.installationDate);

            if (formData.invoiceUpload) {
                warrantyData.append('invoiceUpload', {
                    uri: formData.invoiceUpload.uri,
                    type: formData.invoiceUpload.type,
                    name: formData.invoiceUpload.name,
                });
            }

            await warrantyService.createWarranty(warrantyData);
            navigation.navigate('WarrantyListScreen');
        } catch (error) {
            setErrors({ submitError: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SwipeGestureLayout screen="WarrantyForm">

            <View style={styles.container}>
                <TextInput
                    label="שם לקוח"
                    value={formData.clientName}
                    onChangeText={(value) => handleChange('clientName', value)}
                    style={styles.input}
                />
                {errors.clientName && <Text style={styles.error}>{errors.clientName}</Text>}

                <TextInput
                    label="מוצר"
                    value={formData.productInfo}
                    onChangeText={(value) => handleChange('productInfo', value)}
                    style={styles.input}
                />
                {errors.productInfo && <Text style={styles.error}>{errors.productInfo}</Text>}

                <Button mode="outlined" onPress={() => setShowPicker(true)}>
                    בחר תאריך התקנה
                </Button>
                <TextInput
                    label="תאריך התקנה"
                    value={formData.installationDate}
                    editable={false}
                    style={styles.input}
                />
                {showPicker && (
                    <DateTimePicker
                        value={new Date(formData.installationDate)}
                        mode="date"
                        display="calendar"
                        onChange={handleDateChange}
                    />
                )}

                <Button mode="outlined" onPress={handleTakePhoto}>
                    צילום חשבונית
                </Button>

                <Button mode="outlined" onPress={handleFileUpload}>
                    העלאת חשבונית (תמונה או PDF)
                </Button>

                {/* הצגת הקובץ אם הוא הועלה */}
                {formData.invoiceUpload && (
                    <View style={styles.filePreview}>
                        {formData.invoiceUpload.type.includes('image') ? (
                            <Image source={{ uri: formData.invoiceUpload.uri }} style={styles.imagePreview} />
                        ) : (
                            <Text style={styles.fileName}>{formData.invoiceUpload.name}</Text>
                        )}
                        <Button mode="text" onPress={handleCancelFile}>
                            ביטול
                        </Button>
                    </View>
                )}

                {errors.invoiceUpload && <Text style={styles.error}>{errors.invoiceUpload}</Text>}
                {errors.submitError && <Text style={styles.error}>{errors.submitError}</Text>}

                <Button mode="contained" onPress={handleSubmit} loading={loading}>
                    שלח אחריות
                </Button>
            </View>

        </SwipeGestureLayout>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20 },
    input: { marginBottom: 10 },
    error: { color: 'red', fontSize: 12, marginBottom: 10 },
    filePreview: { marginTop: 10, alignItems: 'center' },
    fileName: { fontSize: 14, marginBottom: 5 },
    imagePreview: { width: 150, height: 150, marginBottom: 10 },
});

export default WarrantyFormScreen;