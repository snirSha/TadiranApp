import express from 'express';
import { getUsersController, getUserByIdController, updateUserDetailsController, deleteUsersController } from '../controllers/userController.js';
import validateObjectId from '../middleware/validateObjectId.js';
import authMiddleware from '../middleware/authMiddleware.js';
import isAdminMiddleware from '../middleware/isAdminMiddleware.js';

const router = express.Router();

router.get('/' ,authMiddleware, isAdminMiddleware, getUsersController);
router.get('/:id' ,authMiddleware, isAdminMiddleware, validateObjectId('id') ,getUserByIdController);
router.put('/:id' ,authMiddleware, isAdminMiddleware, validateObjectId('id') ,updateUserDetailsController);
router.delete('/' ,authMiddleware, isAdminMiddleware ,deleteUsersController);

export default router;