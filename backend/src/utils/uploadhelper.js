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
        console.log("Headers received:", req.headers);
        console.log("Received file:", req.file);
        console.log("Received files:", req.files); // ✅ בדוק גם אם `multer` מזהה `files` במקום `file`
        console.log("Saving file to:", uploadPath);
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        console.log("Generated Filename:", `${Date.now()}-${file.originalname}`);
        cb(null, `${Date.now()}-${file.originalname}`)
    },
});
console.log("Middleware activated: Multer is running"); 
const upload = multer({storage: storage}).single('invoice');

export {upload};