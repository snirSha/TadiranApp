import express from 'express';
import { addWarrantyController , getWarrantiesController, getWarrantyByIdController, deleteWarrantyByIdController} from '../controllers/warrantyController.js';
import { upload } from '../utils/uploadhelper.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.post('/', authMiddleware, upload ,addWarrantyController);//using upload middleware
router.get('/', authMiddleware, getWarrantiesController);
router.get('/:id', authMiddleware, validateObjectId('id') , getWarrantyByIdController);
router.delete('/:id', authMiddleware, validateObjectId('id') , deleteWarrantyByIdController);

export default router;