import {addWarranty, getWarranties, getWarrantyById, deleteWarranties, getAllWarranties} from "../services/warrantyService.js";
import { processOCR } from '../utils/ocrHelper.js';
import Warranty from "../models/warrantyModel.js";
import { downloadInvoice } from "../utils/downloadHelper.js";

const addWarrantyController = async (req, res, next) => {
    const userId = req.user.id; // Get userId from the authenticated user
    const { clientName, productInfo, installationDate } = req.body; // Extract fields from request body
    const invoiceFilePath = req.file ? req.file.path : null;// Extract the file path of the uploaded invoice
    console.log("invoiceFilePath: ",invoiceFilePath);
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
        res.status(200).json({ data: { ...warranty.toObject(), id: warranty._id } }); //adds the id to the object
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
            warranty: updatedWarranty,
        });
    } catch (error) {
        next(error);
    }
};


const deleteWarrantiesController = async (req, res, next) => {
    try {
        const { ids } = req.body; // ✅ קבלת מערך של `ids`
        if (!ids || !ids.length) {
            return res.status(400).json({ message: "No warranty IDs provided." });
        }

        const deletedRecords = await Warranty.deleteMany({ _id: { $in: ids } }); // ✅ מחיקה מרובה

        if (deletedRecords.deletedCount === 0) {
            return res.status(404).json({ message: "No warranties found to delete." });
        }

        res.status(200).json({ ids }); // ✅ החזרת המזהים שנמחקו
    } catch (error) {
        next(error);
    }
}

//Specific controller for handling downlaod file for Admin only
const downloadInvoiceController = async (req, res) => {
    try {
        const { id, filename } = req.params; // הוסף את filename
        const warranty = await Warranty.findById(id);

        if (!warranty || !warranty.invoiceUpload) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        // בדוק אם שם הקובץ תואם את מה שמאוחסן ב-Warranty
        if (warranty.invoiceUpload !== filename) {
            return res.status(400).json({ message: "Filename mismatch" });
        }

        // השתמש בפונקציה downloadInvoice
        downloadInvoice(req, res);
    } catch (error) {
        console.error("Error downloading invoice:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

export { addWarrantyController , getWarrantiesController, getWarrantyByIdController, updateWarrantyController , deleteWarrantiesController, downloadInvoiceController};