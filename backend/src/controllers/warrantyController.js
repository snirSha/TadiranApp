import {addWarranty, getWarranties, getWarrantyById, deleteWarranties, getAllWarranties, getWarrantyFilePath} from "../services/warrantyService.js";
import { processOCR } from '../utils/ocrHelper.js';
import Warranty from "../models/warrantyModel.js";
import path from "path"; 

const addWarrantyController = async (req, res, next) => {
    // console.log("am I her in controller?");
    const userId = req.user.id; // Get userId from the authenticated user
    const { clientName, productInfo, installationDate } = req.body; // Extract fields from request body
    const invoiceFilePath = req.file ? req.file.path : null;// Extract the file path of the uploaded invoice
    // console.log("invoiceFilePath: ",invoiceFilePath);
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
        setTimeout(() => processOCR(warranty.id, invoiceFilePath), 3000);

    } catch (error) {
        next(error); // Pass the error to the middleware
    }
}


const getWarrantiesController = async (req, res, next) =>{
    const userId = req.user.id; // Get userId from the authenticated user
    try {
        const warranties = req.user.isAdmin
            ? await getAllWarranties() 
            : await getWarranties(userId);

        if (!warranties || warranties.length === 0) {
            const errorMessage = req.user.isAdmin 
                ? "No warranties found" // for admin only
                : "No warranties found for this user";
            return res.status(404).json({ message: errorMessage });    
        }

        // console.log("getWarrantiesController warranties: ",warranties);
        res.status(200).json({
            message: 'Warranties retrieved successfully',
            warranties
        });
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
}

//Only admin can use this
const getWarrantyByIdController = async (req, res, next) =>{
    // const userId = req.user.id; // Get userId from the authenticated user
    try {
        const {id} = req.params;
        const warranty = await getWarrantyById(id);
        if (!warranty) {
            return res.status(404).json({ message: "Warranty not found." });
        }
        res.status(200).json({ data: { ...warranty.toObject(), id: warranty._id , installerName: warranty.userId.name} }); //adds the id and installer's name to the object
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
}

//For Admin only
const updateWarrantyController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updatedData = req.body; 
        const warranty = await Warranty.findById(id);
        if (!warranty) {
            return res.status(404).json({ message: "Warranty not found" });
        }

        Object.assign(warranty, updatedData);
        await warranty.save();

        res.status(200).json({
            message: "Warranty updated successfully",
            warranty: warranty,
        });
    } catch (error) {
        next(error);
    }
};


const deleteWarrantiesController = async (req, res, next) => {
    try {
        const { ids } = req.body; 
        if (!ids || !ids.length) {
            return res.status(400).json({ message: "No warranty IDs provided." });
        }

        const deletedIds = await deleteWarranties(ids); 

        if (!deletedIds) {
            return res.status(404).json({ message: "No warranties found to delete." });
        }

        res.status(200).json({ ids: deletedIds });
    } catch (error) {
        next(error);
    }
};

//Specific controller for handling downlaod file for Admin only
const downloadWarrantyFileController = async (req, res, next) => {
    try {
        const warrantyId = req.params.id;
        const filePath = await getWarrantyFilePath(warrantyId);

        if (!filePath) {
            return res.status(404).json({ message: "File not found" });
        }

        console.log("🔍 Sending file:", filePath);

        
        res.setHeader("Content-Disposition", "attachment");
        res.download(filePath);
    } catch (error) {
        console.error("Error downloading file:", error);
        next(error);
    }
};


export { addWarrantyController , getWarrantiesController, getWarrantyByIdController, updateWarrantyController , deleteWarrantiesController, downloadWarrantyFileController};