import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator, DataTable, Tooltip } from 'react-native-paper';
import warrantyService from '../services/warrantyService';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FloatingButton from '../components/FloatingButton';

const WarrantyListScreen = () => {
    const { userToken } = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        if (!userToken) {
            navigation.replace('Login'); // אם המשתמש לא מחובר, מעבר אוטומטי ללוגאין
        }
    }, [userToken]);


    const [warranties, setWarranties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        //Phase 1: show first warranties
        const fetchWarranties = async () => {
            try {
                const data = await warrantyService.getWarranties();
                setWarranties(data);
            } catch (err) {
                setError('שגיאה בטעינת האחריות');
            } finally {
                setLoading(false);
            }
        };

        fetchWarranties();

        //Phase 2: show updated warranties
        const socket = new WebSocket("ws://localhost:8080");

        socket.onmessage = (event) => {
            const updatedWarranty = JSON.parse(event.data);
            console.log("🔍 אחריות שקיבלה עדכון:", updatedWarranty);
        
            setWarranties((prevWarranties) => {
                return prevWarranties.map((w) => {
                    console.log(`🔍 מעדכן אחריות: ${w._id} === ${updatedWarranty._id}`); // ✅ שינוי ל-_id
                    return w._id === updatedWarranty._id 
                        ? { ...w, status: updatedWarranty.status, processDate: updatedWarranty.processDate } 
                        : w;
                });
            });
        };

        // close the socket connection when the component unmounts
        return () => {
            socket.close();
        };

    }, []);

    // פונקציה לקביעת סטטוס על פי הבקאנד
    const determineStatus = (installationDate, extractedDate) => {
        if (!extractedDate) return { status: "Manual Review", tooltip: "OCR parsing failed", color: "blue" };

        const installation = new Date(installationDate);
        const extracted = new Date(extractedDate);
        const diffDays = Math.abs((installation - extracted) / (1000 * 60 * 60 * 24));

        if (diffDays <= 21) {
            return { status: "Approved", tooltip: "Invoice date within ±21 days of installation date", color: "green" };
        } else {
            return { status: "Rejected", tooltip: "Date out of range", color: "red" };
        }
    };

    if (loading) return <ActivityIndicator animating size="large" />;
    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        // <SwipeGestureLayout screen="WarrantyForm">

            <View style={styles.container}>
                {warranties.length === 0 ? (
                    <Text style={styles.noWarranties}>אין אחריות להצגה</Text>
                ) : (
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>שם לקוח</DataTable.Title>
                            <DataTable.Title>מוצר</DataTable.Title>
                            <DataTable.Title>תאריך התקנה</DataTable.Title>
                            <DataTable.Title>סטטוס</DataTable.Title>
                        </DataTable.Header>

                        {warranties.map((item, index) => {
                            const { status, tooltip, color } = determineStatus(item.installationDate, item.extractedDate);

                            return (
                                <DataTable.Row key={`{item._id}-${index}`}>
                                    <DataTable.Cell>{item.clientName}</DataTable.Cell>
                                    <DataTable.Cell>{item.productInfo}</DataTable.Cell>
                                    <DataTable.Cell>{new Date(item.installationDate).toLocaleDateString()}</DataTable.Cell>
                                    <DataTable.Cell>
                                        <Tooltip title={tooltip}>
                                            <Text style={[styles.status, { color }]}>{status}</Text>
                                        </Tooltip>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            );
                        })}
                    </DataTable>
                )}

                <FloatingButton title="להוספת אחריות" onPress={() => navigation.navigate("WarrantyForm")} />
            </View>

        // </SwipeGestureLayout>        
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        justifyContent: 'center',
        padding: 20 ,
        writingDirection: "rtl", //  הגדרת הכיוון לטופס
    },
    error: { color: 'red', fontSize: 16, textAlign: 'center', marginTop: 20 },
    noWarranties: { fontSize: 16, textAlign: 'center', color: 'gray', marginTop: 20 },
});


export default WarrantyListScreen;