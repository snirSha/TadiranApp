import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

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
        console.log("am I her in nulter?",file);
        if (!file) {
            console.error("No file received!");
            return cb(new Error("No file received"), null);
        }
        cb(null, uploadPath);
    }
    ,
    filename: (req, file, cb) => {
        console.log("Generated Filename:", `${Date.now()}-${file.originalname}`);
        cb(null, `${Date.now()}-${file.originalname}`)
    },
});

const fileFilter = (req, file, cb) => {
    console.log("Received file MIME type:", file.mimetype);
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true); // קובץ נתמך
    } else {
        console.error("Unsupported file type:", file.mimetype);
        cb(new Error("Unsupported file type"), false); // קובץ לא נתמך
    }
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
}).single('invoice');

export {upload};