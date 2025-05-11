import {addWarranty, getWarranties, getWarrantyById, deleteWarrantyById} from "../services/warrantyService.js";
import { extractDates } from '../utils/ocrHelper.js';

const addWarrantyController = async (req, res, next) => {
    const userId = req.user.id; // Get userId from the authenticated user
    const { customerInfo, productInfo, installationDate } = req.body; // Extract fields from request body
    const invoiceFilePath = req.file?.path; // Extract the file path of the uploaded invoice
    console.log("req.file", req.file);
    try {
        // Validate required fields
        if (!customerInfo || !productInfo || !installationDate || !invoiceFilePath) {
            return res.status(400).json({ message: "All fields are required, including the invoice file." });
        }

        //Call ocrHelper to extract text from the invoice file pdf/image
        let extractedDate = null;
        try{
            const dates = await extractDates(invoiceFilePath);
            if(dates && dates.length > 0){
                extractedDate = dates[0];//use first date found
            }
        }catch(error){
            console.error("Error extracting date from invoice: ", error);
        }

        // Add the warranty for the user
        const warranty = await addWarranty(userId,
             {
                customerInfo,
                productInfo,
                installationDate,
                invoiceFilePath,
                extractedDate
             }
              );
        res.status(201).json({
            message: "Warranty added successfully",
            warranty,
        });
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