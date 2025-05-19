import express from 'express';
import { getUsersController, getUserByIdController, updateUserDetailsController, deleteUsersController } from '../controllers/userController.js';
import validateObjectId from '../middleware/validateObjectId.js';
import authMiddleware from '../middleware/authMiddleware.js';
import isAdminMiddleware from '../middleware/isAdminMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       **Access Control:**
 *
 *       This endpoint is restricted to users with the `admin` role.
 *       Ensure that your JWT token includes the appropriate role information.
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       403:
 *         description: Forbidden
 */
router.get('/' ,authMiddleware, isAdminMiddleware, getUsersController);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       **Access Control:**
 *
 *       This endpoint is restricted to users with the `admin` role.
 *       Ensure that your JWT token includes the appropriate role information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid ID
 *       403:
 *         description: Forbidden
 */
router.get('/:id' ,authMiddleware, isAdminMiddleware, validateObjectId('id') ,getUserByIdController);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       **Access Control:**
 *
 *       This endpoint is restricted to users with the `admin` role.
 *       Ensure that your JWT token includes the appropriate role information.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: The new username
 *               email:
 *                 type: string
 *                 description: The new email
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Invalid ID or bad request
 *       403:
 *         description: Forbidden
 */
router.put('/:id' ,authMiddleware, isAdminMiddleware, validateObjectId('id') ,updateUserDetailsController);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       **Access Control:**
 *
 *       This endpoint is restricted to users with the `admin` role.
 *       Ensure that your JWT token includes the appropriate role information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 description: List of user IDs to delete
 *                 items:
 *                   type: string
 *           examples:
 *             singleUser:
 *               summary: Delete one user
 *               value:
 *                 ids: ["682753af5e9eb3d38c651b6f"]
 *             multipleUsers:
 *               summary: Delete multiple users
 *               value:
 *                 ids: ["682753af5e9eb3d38c651b6f", "684adf7c2e3b1234567abcde"]
 *     responses:
 *       200:
 *         description: Users deleted successfully
 *       403:
 *         description: Forbidden
 */
router.delete('/' ,authMiddleware, isAdminMiddleware ,deleteUsersController);

export default router;