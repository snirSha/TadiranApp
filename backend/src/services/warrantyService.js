import Warranty from "../models/warrantyModel.js";
import path from "path";
import * as fs from "fs";
import db from "../config/firebaseConfig.js"; 
import { Timestamp } from "firebase/firestore";

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
    await warranty.save(); //Updated mongoDB

    await syncWarrantyWithFirebase(warranty); //Update Firebase

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
    const warrantiesToDelete = await Warranty.find({ _id: { $in: warrantyIds } });

    const result = await Warranty.deleteMany({ _id: {$in: warrantyIds} });

    if (result.deletedCount > 0) {
        // delete from firebase
        await Promise.all(
            warrantyIds.map((id) => db.collection("warranties").doc(id.toString()).delete())
        );

        // delete from uploads
        await Promise.all(
            warrantiesToDelete.map(({ invoiceUpload }) => {
                if (invoiceUpload && fs.existsSync(invoiceUpload)) {
                    console.log(`Deleting file: ${invoiceUpload}`);
                    return fs.promises.unlink(invoiceUpload);
                }
            })
        );
    }


    return result.deletedCount > 0 ? warrantyIds : null;
}

//For admin and user after proccessing the file with OCR
const updateWarranty = async (warrantyId, updateFields) => {
    const warranty = await Warranty.findByIdAndUpdate(warrantyId, updateFields, { new: true });
    if (warranty) await syncWarrantyWithFirebase(warranty); //Update Firebase
    return warranty;
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


const syncWarrantyWithFirebase = async (warranty) => {
    // console.log("warranty in backend:  ",warranty);
    await db.collection("warranties").doc(warranty._id.toString()).set({
        userId: warranty.userId.toString(),
        clientName: warranty.clientName,
        productInfo: warranty.productInfo,
        installationDate: warranty.installationDate 
            ? new Date(warranty.installationDate).toISOString()
            : null,
        status: warranty.status,
        invoiceUpload: warranty.invoiceUpload,
        extractedDate: warranty.extractedDate
    });
};

export { addWarranty, getWarranties, getWarrantyById, deleteWarranties, updateWarranty, getAllWarranties, getWarrantyFilePath};