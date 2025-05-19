import express from 'express';
import { addWarrantyController , getWarrantiesController, getWarrantyByIdController, updateWarrantyController, deleteWarrantiesController, downloadWarrantyFileController } from '../controllers/warrantyController.js';
import { upload } from '../utils/uploadhelper.js';
import authMiddleware from '../middleware/authMiddleware.js';
import validateObjectId from '../middleware/validateObjectId.js';
import isAdminMiddleware from '../middleware/isAdminMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * /warranties:
 *   post:
 *     summary: Add a new warranty
 *     tags: [Warranties]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: The client's name
 *                 example: "John Doe"
 *               productInfo:
 *                 type: string
 *                 description: Information about the product
 *                 example: "Air Conditioner model C137"
 *               installationDate:
 *                 type: string
 *                 format: date
 *                 description: The installation date
 *                 example: "2023-08-15"
 *               invoice:
 *                 type: string
 *                 format: binary
 *                 description: The invoice file to upload
 *                 example: "file.jpg"
 *     responses:
 *       201:
 *         description: Warranty created successfully
 *       400:
 *         description: Bad request
 */
router.post('/', authMiddleware, upload ,addWarrantyController);//using upload middleware

/**
 * @swagger
 * /warranties:
 *   get:
 *     summary: Get all warranties
 *     tags: [Warranties]
 *     security:
 *       - bearerAuth: []
 *     description: |
 *       **Access Control:**
 *
 *       - Users with roles `admin` can view all warranties.
 *       - Regular users can view only their own warranties.
 *
 *       Ensure that the JWT token includes the user's role information to enforce access control.
 *     responses:
 *       200:
 *         description: List of warranties
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.get('/', authMiddleware, getWarrantiesController); //In the controller there is a check id the user is admin and send to the right service

/**
 * @swagger
 * /warranties/{id}:
 *   get:
 *     summary: Get warranty by ID
 *     tags: [Warranties]
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
 *         description: The warranty ID
 *     responses:
 *       200:
 *         description: Warranty details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Invalid ID
 *       403:
 *         description: Forbidden
 */
router.get('/:id', authMiddleware, validateObjectId('id') , getWarrantyByIdController);

/**
 * @swagger
 * /warranties/{id}:
 *   put:
 *     summary: Update warranty details
 *     tags: [Warranties]
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
 *         description: The warranty ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clientName:
 *                 type: string
 *                 description: The updated client name
 *                 example: "John Doe"
 *               productInfo:
 *                 type: string
 *                 description: The updated product information
 *                 example: "Air Conditioner model C137"
 *               installationDate:
 *                 type: string
 *                 format: date
 *                 description: The updated installation date
 *                 example: "2023-08-15"
 *               status:
 *                 type: string
 *                 enum: ["Pending", "Approved", "Rejected", "Manual Review"]
 *                 description: The updated status of the warranty
 *                 example: "Approved"
 *           example:
 *             clientName: "John Doe"
 *             productInfo: "Air Conditioner model C137"
 *             installationDate: "2023-08-15"
 *             status: "Approved"
 *     responses:
 *       200:
 *         description: Warranty updated successfully
 *       400:
 *         description: Invalid ID or bad request
 *       403:
 *         description: Forbidden
 */
router.put("/:id", authMiddleware, isAdminMiddleware,validateObjectId('id'), updateWarrantyController); //Only for Admin

/**
 * @swagger
 * /warranties:
 *   delete:
 *     summary: Delete warranties
 *     tags: [Warranties]
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
 *                 description: List of warranty IDs to delete
 *                 items:
 *                   type: string
 *           example:
 *             ids: ["6825ed93d7625baa255e77cc", "6825ed92d7625baa255e77c9"]
 *     responses:
 *       200:
 *         description: Warranties deleted successfully
 *       403:
 *         description: Forbidden
 */
router.delete('/', authMiddleware, isAdminMiddleware, deleteWarrantiesController);//Only for Admin

/**
 * @swagger
 * /warranties/{id}/download:
 *   get:
 *     summary: Download warranty file
 *     tags: [Warranties]
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
 *         description: The warranty ID
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid ID
 *       403:
 *         description: Forbidden
 */
router.get("/:id/download" , authMiddleware, isAdminMiddleware, validateObjectId('id') , downloadWarrantyFileController);//Specific route for handling downlaod file for Admin only 


export default router;