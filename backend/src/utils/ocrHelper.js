import tesseract from 'node-tesseract-ocr';
import sharp from 'sharp'; // For image preprocessing
import path from 'path';
import fs from 'fs';
import moment from 'moment'; // calculate date with no time zone shoft

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

export { extractDates };