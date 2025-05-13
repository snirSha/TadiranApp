import api from './api';

const createWarranty = async (warrantyData) => {
    try {
        const response = await api.post('/warranties', warrantyData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'שגיאה ביצירת אחריות');
    }
};

const getWarranties = async () => {
    try {
        const response = await api.get('/warranties');
        return response.data.warranties;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'שגיאה בקבלת רשימת האחריות');
    }
};

const getWarrantyById = async (warrantyId) => {
    try {
        const response = await api.get(`/warranties/${warrantyId}`);
        return response.data.warranty;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'אחריות לא נמצאה');
    }
};

const deleteWarrantyById = async (warrantyId) => {
    try {
        const response = await api.delete(`/warranties/${warrantyId}`);
        return response.data.message;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'שגיאה במחיקת אחריות');
    }
};

export default { createWarranty, getWarranties, getWarrantyById, deleteWarrantyById };