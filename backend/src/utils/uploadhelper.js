import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the absolute path for the uploads directory (outside src)
const uploadPath = path.join(__dirname, '../../uploads/invoices');

// Create the directory if it doesn't exist
if(!fs.existsSync(uploadPath)){
    fs.mkdirSync(uploadPath, {recursive: true});
}

// multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("Received file:", file);
        if (!file) {
            console.error("No file received!");
            return cb(new Error("No file received"), null);
        }
        cb(null, uploadPath);
    }
    ,
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname}`;
        const fileUrl = `${process.env.FILES_PATH}/${fileName}`;

        console.log("Generated Filename:", fileName);
        console.log("File URL:", fileUrl); 

        req.fileUrl = fileUrl; //save this url for future download from adming panel
        cb(null, fileName);
    },
});

const fileFilter = (req, file, cb) => {
    console.log("Received file MIME type:", file.mimetype);
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // supported file
    } else {
        console.error("Unsupported file type:", file.mimetype);
        cb(new Error("Unsupported file type"), false); // file not supposeted
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
}).single('invoice');

export {upload};