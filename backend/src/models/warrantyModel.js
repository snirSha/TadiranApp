import mongoose from "mongoose";

const warrantySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User model
        required: true,
    },
    clientName: {
        type: String,
        required: true,
    },
    productInfo: {
        type: String, // Product type (e.g., "Air Conditioner model C137")
        required: true,
    },
    installationDate: {
        type: Date,
        required: true,
    },
    invoiceUpload: {
        type: String,
        required: true,
    },
    extractedDate: {
        type: Date, // Store the extracted date (or null if not found)
        default: null,
    },
    status: { 
        type: String,
        enum: ["Pending", "Approved", "Rejected", "Manual Review"],
        default: "Pending" // default status
    }
});


const Warranty = mongoose.model('Warranty', warrantySchema);
export default Warranty;