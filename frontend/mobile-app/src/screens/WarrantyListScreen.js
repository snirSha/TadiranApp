import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator, DataTable, Tooltip } from 'react-native-paper';
import warrantyService from '../services/warrantyService';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FloatingButton from '../components/FloatingButton';
import theme from "../theme";

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
            //get from websocket the peocessed date and the status and set the right warranty
            setWarranties((prevWarranties) => {
                return prevWarranties.map((w) => {
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

    const getStatusAttributes = (status) => {
        switch (status) {
            case "Manual Review":
                return { tooltip: "OCR parsing failed", color: "blue" };
            case "Approved":
                return { tooltip: "Invoice date within ±21 days of installation date", color: "green" };
            case "Rejected":
                return { tooltip: "Date out of range", color: "red" };
            default:
                return { tooltip: "Waiting for server response", color: "black" };
        }
    };

    if (loading) return <ActivityIndicator animating size="large" />;
    if (error) return <Text style={styles.errorText}>{errorMessage}</Text>;

    return (
        // <SwipeGestureLayout screen="WarrantyForm">
        <>
            <View style={styles.container}>
                {warranties.length === 0 ? (
                    <Text style={styles.noWarranties}>אין אחריות להצגה</Text>
                ) : (
                    <DataTable>
                        <DataTable.Header style={styles.tableHeader}>
                            <DataTable.Title textStyle={styles.tableHeaderText}>שם לקוח</DataTable.Title>
                            <DataTable.Title textStyle={styles.tableHeaderText}>מוצר</DataTable.Title>
                            <DataTable.Title textStyle={styles.tableHeaderText}>תאריך התקנה</DataTable.Title>
                            <DataTable.Title textStyle={styles.tableHeaderText}>סטטוס</DataTable.Title>
                        </DataTable.Header>

                        {warranties.map((item, index) => {
                            const { tooltip, color } = getStatusAttributes(item.status);

                            return (
                                <DataTable.Row key={`${item._id}-${index}`}>
                                    <DataTable.Cell>{item.clientName}</DataTable.Cell>
                                    <DataTable.Cell>{item.productInfo}</DataTable.Cell>
                                    <DataTable.Cell>{new Date(item.installationDate).toLocaleDateString()}</DataTable.Cell>
                                    <DataTable.Cell>
                                        <Tooltip title={tooltip}>
                                            <Text style={[styles.status, { color }]}>{item.status}</Text>
                                        </Tooltip>
                                    </DataTable.Cell>
                                </DataTable.Row>
                            );
                        })}
                    </DataTable>
                )}
            </View>
            <FloatingButton title="להוספת אחריות" onPress={() => navigation.navigate("WarrantyForm")} />
        </>
        // </SwipeGestureLayout>        
    );
};

const styles = StyleSheet.create({
    ...theme.styles,
    tableHeader: {
        backgroundColor: "#b8b6ae", // ✅ רקע זהוב כדי להבליט את הכותרות
        paddingVertical: 10, // ✅ מרווח אנכי כדי לתת לכותרות יותר נראות
    },
    tableHeaderText: {
        fontSize: 18, // ✅ גופן גדול יותר
        fontWeight: "bold", // ✅ כותרות בולטות
        color: "#000", // ✅ טקסט שחור עם ניגוד טוב
        textAlign: "center", // ✅ מיושרות למרכז
    },
    noWarranties: { fontSize: 16, textAlign: 'center', color: 'gray', marginTop: 20 },
});


export default WarrantyListScreen;