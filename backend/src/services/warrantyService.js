import Warranty from "../models/warrantyModel.js";

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

const getWarranties = async (userId) => {
    // Retrieve all warranties for the user
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


export { addWarranty, getWarranties, getWarrantyById, deleteWarranties, updateWarranty, getAllWarranties};