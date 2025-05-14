import tesseract from 'node-tesseract-ocr';
import sharp from 'sharp'; // For image preprocessing
import path from 'path';
import fs from 'fs';
import { updateWarrantyDateAndStatus, getWarrantyById } from '../services/warrantyService.js';
import { broadcastUpdate } from "../wsServer.js";

const config = { 
    lang: "eng", // Add "heb" if needed: "eng+heb"
    oem: 3,      // Use the best OCR engine available
    psm: 6,      // Assume a single uniform block of text
    tessedit_char_whitelist: "0123456789/.-", // Whitelist characters for dates
};

// Preprocess the image to improve OCR accuracy
const preprocessImage = async (inputPath, outputPath) => {
    try {
        await sharp(inputPath)
            .grayscale() // Convert to grayscale
            .threshold(150) // Apply binary thresholding
            .normalize() // Enhance contrast
            .resize(1000) // Resize for better OCR accuracy
            .toFile(outputPath);
    } catch (error) {
        console.error("Error during image preprocessing:", error.message);
    }
};

const extractDates = async (inputPath) => {
    const processedPath = path.join(path.dirname(inputPath), 'processed.jpg'); // Save processed image in the same directory

    try {
        // Preprocess the image
        await preprocessImage(inputPath, processedPath);

        // Recognize text using Tesseract
        const text = await tesseract.recognize(processedPath, config);
        // console.log("Extracted Text: ", text);

        // Extract dates using regex DD/MM/YYYY
        const dateRegex = /\b\d{1,2}[-\/.]\d{1,2}[-\/.]\d{2,4}\b/g;
        const dates = text.match(dateRegex);

        // Clean up the processed file after OCR
        fs.unlink(processedPath, (err) => {
            if (err) {
                console.error("Error deleting processed file:", err.message);
            } else {
                console.log("Processed file deleted:", processedPath);
            }
        });

        // Convert the first extracted date to UTC, no time zone shift
        if (dates && dates.length > 0) {
            const [day, month, year] = dates[0].split(/[-\/.]/).map(Number);
            const extractedDate = new Date(Date.UTC(year, month - 1, day)); // Construct the date as UTC
            return [extractedDate];
        }
        return null;
    } catch (error) {
        console.error("Error during OCR:", error.message);
        return null;
    }
};

// Process the OCR result and update the warranty status
const processOCR = async (userId, warrantyId, invoiceFilePath) => {
    try {
        const dates = await extractDates(invoiceFilePath);
        let extractedDate = dates && dates.length > 0 ? dates[0] : null;
        let status = "Pending"; // default
        
        if (extractedDate) {
            const warranty = await getWarrantyById(userId, warrantyId);
            const diffDays = Math.abs((new Date(warranty.installationDate) - new Date(extractedDate)) / (1000 * 60 * 60 * 24));

            status = (diffDays <= 21) ? "Approved" : "Rejected"; 
        }else{
            status = "Manual Review"; //Only if OCR couldn't exclude the date
        }

        const updatedWarranty = await updateWarrantyDateAndStatus(warrantyId, { extractedDate, status }); // עדכון מסד הנתונים
        
        broadcastUpdate(updatedWarranty);// Broadcast the update to the client using websokets

        console.log(`Warranty ID ${warrantyId} updated with status: ${status}`);
    } catch (error) {
        console.error("Error processing OCR:", error);
    }
};


export { extractDates , processOCR};