import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from 'dotenv';
dotenv.config();
const pathToFiles = process.env.FILES_PATH;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basePath = path.join(__dirname, "../../uploads/invoices");

const getInvoiceURL = (filename) => {
    return `${pathToFiles}/${filename}`;
};

const downloadInvoice = (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(basePath, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found" });
    }

    res.download(filePath);
};

export { getInvoiceURL, downloadInvoice };