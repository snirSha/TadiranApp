import express from 'express';
import { getUsersController, getUserByIdController, updateUserDetailsController, deleteUserController } from '../controllers/userController.js';
import validateObjectId from '../middleware/validateObjectId.js';

const router = express.Router();

router.get('/' ,getUsersController);
router.get('/:id' , validateObjectId('id') ,getUserByIdController);
router.put('/:id' , validateObjectId('id') ,updateUserDetailsController);
router.delete('/:id' , validateObjectId('id') ,deleteUserController);

export default router;