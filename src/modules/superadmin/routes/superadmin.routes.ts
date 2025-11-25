import { Router } from 'express';
import { registerSuperAdmin, loginSuperAdmin } from '../controllers/superadmin.controller';

const router = Router();

/**
 * @openapi
 * /api/v1/superadmin/register:
 *   post:
 *     tags: [SuperAdmin]
 *     summary: Register a new SuperAdmin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: SuperAdmin registered
 */
router.post('/register', registerSuperAdmin);

/**
 * @openapi
 * /api/v1/superadmin/login:
 *   post:
 *     tags: [SuperAdmin]
 *     summary: SuperAdmin login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginSuperAdmin);

export default router;
