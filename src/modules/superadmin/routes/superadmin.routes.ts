import { Router } from 'express';
import {
  registerSuperAdmin,
  loginSuperAdmin,
  getAllSuperAdmins,
} from '../controllers/superadmin.controller';
import {
  createSuperadminSchema,
  loginSuperAdminValidator,
} from '../validator/superadmin.validator';
import { validateSchema } from '@/core/helper/validation_helper';

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
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 description: SuperAdmin role (e.g., owner, manager)
 *     responses:
 *       201:
 *         description: SuperAdmin registered
 */
router.post('/register', validateSchema(createSuperadminSchema), registerSuperAdmin);

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
router.post('/login', validateSchema(loginSuperAdminValidator), loginSuperAdmin);

router.get('/', getAllSuperAdmins);

export default router;
