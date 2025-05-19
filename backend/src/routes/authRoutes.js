import express from 'express';
import { signupController, loginController } from '../controllers/authController.js';

const router = express.Router();
/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's full name
 *                 example: "אריה דרעי"
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: "installer11@gmail.com"
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "ins123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/signup', signupController);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email address
 *                 example: "snirsha1992@gmail.com"
 *               password:
 *                 type: string
 *                 description: The user's password
 *                 example: "snir1992"
  *           examples:
 *              adminUser:
 *                  summary: Admin login
 *                  value:
 *                      email: "admin@tadiran.com"
 *                      password: "admin123"
 *              regularUser:
 *                  summary: Regular user login
 *                  value:
 *                      email: "snirsha1992@gmail.com"
 *                      password: "snir1992"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/login', loginController);

export default router;