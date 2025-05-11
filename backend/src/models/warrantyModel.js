import mongoose from "mongoose";

const warrantySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // References the User model
        required: true,
    },
    customerInfo: {
        name: String,
        email: String,
        phoneNumber: String,
        address: String,
    },
    productInfo: {
        type: {
            type: String, // Product type (e.g., "Air Conditioner")
            required: true,
        },
        code: {
            type: String, // Product code (e.g., "AC12345")
            required: true,
        },
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
});


const Warranty = mongoose.model('Warranty', warrantySchema);
export default Warranty;