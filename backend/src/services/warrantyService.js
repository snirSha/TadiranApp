import Warranty from "../models/warrantyModel.js";
import path from "path";
import * as fs from "fs";

const addWarranty = async (userId, warrantyData) => {
    // Create and save the warranty
    const warranty = new Warranty({
        userId,
        clientName: warrantyData.clientName,
        productInfo: warrantyData.productInfo,
        installationDate: warrantyData.installationDate,
        invoiceUpload: warrantyData.invoiceFilePath, // Save the file path in the warranty data
        extractedDate: warrantyData.extractedDate, // Save the extracted date
    });
    await warranty.save();

    return warranty;
}

const getWarranties = async (userId) => {// Retrieve all warranties for the user
    const warranties = await Warranty.find({ userId });
    return warranties;
};

const getWarrantyById = async (warrantyId) => {//Gets warranty by warranty Id for admin panel
    const warranty = await Warranty.findOne({ _id: warrantyId }).populate("userId", "name"); //for admin table
    if (!warranty) throw new Error("Warranty not found");
    return warranty;
};

//For admin only, can delete few records at once
const deleteWarranties = async (warrantyIds) => {
    const result = await Warranty.deleteMany({ _id: {$in: warrantyIds} });
    return result.deletedCount > 0 ? warrantyIds : null;
}

//For admin and user after proccessing the file with OCR
const updateWarranty = async (warrantyId, updateFields) => {
    return await Warranty.findByIdAndUpdate(warrantyId, updateFields, { new: true });
};

//Only for admin-panel
const getAllWarranties = async () => {
    const warranties = await Warranty.find({}).populate("userId", "name");//importent for the admin table to get the installer's name
    // console.log("warranties in getAllWarranties: ", warranties);
    return warranties;
};

//Only for admin-panel -check and send back the file path for download
const getWarrantyFilePath = async (warrantyId) => {
    const warranty = await Warranty.findById(warrantyId);

    if (!warranty || !warranty.invoiceUpload) {
        console.error(`No file found for warranty ID: ${warrantyId}`);
        return null;
    }

    const filePath = path.resolve(warranty.invoiceUpload);
    console.log("🔍 File Path Resolved:", filePath);

    if (!fs.existsSync(filePath)) {
        console.error(`File does not exist on server: ${filePath}`);
        return null;
    }

    return filePath;
};


export { addWarranty, getWarranties, getWarrantyById, deleteWarranties, updateWarranty, getAllWarranties, getWarrantyFilePath};