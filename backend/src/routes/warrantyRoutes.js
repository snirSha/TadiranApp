import express from 'express';
import { addWarrantyController , getWarrantiesController, getWarrantyByIdController, updateWarrantyController, deleteWarrantiesController, downloadWarrantyFileController } from '../controllers/warrantyController.js';
import { upload } from '../utils/uploadhelper.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';
import isAdminMiddleware from '../middleware/isAdminMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, upload ,addWarrantyController);//using upload middleware
router.get('/', authMiddleware, getWarrantiesController); //In the controller there is a check id the user is admin and send to the right service
router.get('/:id', authMiddleware, validateObjectId('id') , getWarrantyByIdController);
router.put("/:id", authMiddleware, isAdminMiddleware,validateObjectId('id'), updateWarrantyController); //Only for Admin
router.delete('/', authMiddleware, isAdminMiddleware, deleteWarrantiesController);//Only for Admin

//Specific route for handling downlaod file for Admin only 
router.get("/:id/download" , authMiddleware, isAdminMiddleware, validateObjectId('id') , downloadWarrantyFileController);


export default router;