import Warranty from "../models/warrantyModel.js";

const addWarranty = async (userId, warrantyData) => {
    // Create and save the warranty
    const warranty = new Warranty({
        userId,
        customerInfo: warrantyData.customerInfo,
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
    const warranties = await Warranty.find({ userId }).select("_id");
    return warranties.map(warranty => warranty._id); // Return only the IDs
};

const getWarrantyById = async (userId, warrantyId) => {
    // Retrieve the warranty by ID and ensure it belongs to the user
    const warranty = await Warranty.findOne({ _id: warrantyId, userId })
    if (!warranty) throw new Error("Warranty not found or not associated with this user");
    return warranty;
};

const deleteWarrantyById = async (userId, warrantyId) => {
    // Delete the warranty by ID and ensure it belongs to the user
    const warranty = await Warranty.findOneAndDelete({ _id: warrantyId, userId });
    if (!warranty) throw new Error("Warranty not found or not associated with this user");
    return warranty;
}


export { addWarranty, getWarranties, getWarrantyById, deleteWarrantyById};