import {addWarranty, getWarranties, getWarrantyById, deleteWarrantyById, updateWarrantyStatus} from "../services/warrantyService.js";
import { processOCR } from '../utils/ocrHelper.js';

const addWarrantyController = async (req, res, next) => {
    const userId = req.user.id; // Get userId from the authenticated user
    const { clientName, productInfo, installationDate } = req.body; // Extract fields from request body
    const invoiceFilePath = req.file ? req.file.path : null;// Extract the file path of the uploaded invoice
  
    if (!invoiceFilePath) {
        return res.status(400).json({ message: "קובץ חשבונית לא הועלה כראוי" });
    }

    try {

        // Add the warranty for the user
        const warranty = await addWarranty(userId,
            {
                clientName,
                productInfo,
                installationDate,
                invoiceFilePath,
                extractedDate: null,
                status: "Pending"
            }
        );
        
        res.status(201).json({
            message: "Warranty added successfully",
            warranty,
        });
        
        // Perform OCR to extract dates from the invoice and update status
        setTimeout(() => processOCR(userId, warranty.id, invoiceFilePath), 3000);

    } catch (error) {
        next(error); // Pass the error to the middleware
    }
}


const getWarrantiesController = async (req, res, next) =>{
    const userId = req.user.id; // Get userId from the authenticated user
    try {
        const warranties = await getWarranties(userId);
        if (!warranties || warranties.length === 0) {
            return res.status(404).json({ message: 'No warranties found for this user' });
        }
        res.status(200).json({
            message: 'Warranties retrieved successfully',
            warranties
        });
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
}

const getWarrantyByIdController = async (req, res, next) =>{
    const userId = req.user.id; // Get userId from the authenticated user
    try {
        const {id} = req.params;
        const warranty = await getWarrantyById(userId, id);
        if (!warranty) {
            return res.status(404).json({ message: "Warranty not found." });
        }
        res.status(200).json({
            message: 'Warranty retrieved successfully',
            warranty
        });
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
}

const deleteWarrantyByIdController = async (req, res, next) => {
    const userId = req.user.id; // Get userId from the authenticated user
    try {
        const {id} = req.params;
        const warranty = await deleteWarrantyById(userId, id);
        if (!warranty) {
            return res.status(404).json({ message: "Warranty not found." });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
}

export { addWarrantyController , getWarrantiesController, getWarrantyByIdController, deleteWarrantyByIdController};