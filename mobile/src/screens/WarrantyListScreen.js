import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ActivityIndicator, DataTable, Tooltip } from 'react-native-paper';
import warrantyService from '../services/warrantyService';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FloatingButton from '../components/FloatingButton';
import theme from "../theme";
import { db, collection, onSnapshot } from "../config/firebaseConfig"; 

const WarrantyListScreen = () => {
    const { userToken } = useContext(AuthContext);
    const navigation = useNavigation();

    useEffect(() => {
        if (!userToken) {
            navigation.replace('Login'); // if no token - go to login
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

        //Phase 2: show updated warranties, listening to firebase changes
        const unsubscribe = onSnapshot(collection(db, "warranties"), (snapshot) => {
            setWarranties((prevWarranties) => {
                return prevWarranties.map((w) => {
                    const updatedWarranty = snapshot.docs.find(doc => doc.id === w._id);
                    return updatedWarranty
                        ? { ...w, ...updatedWarranty.data() } // merged changes to the list of warranties
                        : w;
                });
            });
        });
    
        return () => unsubscribe();
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
    // if (error) return <Text style={styles.errorText}>{errorMessage}</Text>;

    return (
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
    );
};

const styles = StyleSheet.create({
    ...theme.styles,
    tableHeader: {
        backgroundColor: "#b8b6ae", 
        paddingVertical: 10, 
    },
    tableHeaderText: {
        fontSize: 18,
        fontWeight: "bold", 
        color: "#000", 
        textAlign: "center", 
    },
    noWarranties: { fontSize: 16, textAlign: 'center', color: 'gray', marginTop: 20 },
});


export default WarrantyListScreen;