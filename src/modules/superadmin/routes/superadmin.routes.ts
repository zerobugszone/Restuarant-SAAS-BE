import { Router } from 'express';
import superAdminController from '../controllers/superadmin.controller';
import {
  createSuperadminSchema,
  loginSuperAdminValidator,
  changePasswordValidator,
  refreshTokenValidator,
} from '../validator/superadmin.validator';
import { validateSchema } from '@/core/helper/validation_helper';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';

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
router.post('/register', validateSchema(createSuperadminSchema), superAdminController.register);

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
router.post('/login', validateSchema(loginSuperAdminValidator), superAdminController.login);

/**
 * @openapi
 * /api/v1/superadmin:
 *   get:
 *     tags: [SuperAdmin]
 *     summary: Get all SuperAdmins
 *     responses:
 *       200:
 *         description: List of all SuperAdmins
 */

router.get('/', superAdminController.getAll);

/**
 * @openapi
 * /api/v1/superadmin/refresh-token:
 *   post:
 *     tags: [SuperAdmin]
 *     summary: Refresh access token using a valid refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Valid refresh token
 *     responses:
 *       200:
 *         description: New access token generated
 *       400:
 *         description: Invalid or expired refresh token
 */

router.post(
  '/refresh-token',
  authenticationMiddleware,
  validateSchema(refreshTokenValidator),
  superAdminController.refreshAccessToken
);

/**
 * @openapi
 * /api/v1/superadmin/change-password:
 *   post:
 *     tags: [SuperAdmin]
 *     summary: Change password for logged-in SuperAdmin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Password successfully changed
 *       400:
 *         description: Invalid old password
 */

router.post(
  '/change-password',
  validateSchema(changePasswordValidator),
  superAdminController.changePassword
);

/**
 * @openapi
 * /api/v1/superadmin/{id}:
 *   get:
 *     tags: [SuperAdmin]
 *     summary: Get SuperAdmin by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: SuperAdmin ID
 *     responses:
 *       200:
 *         description: SuperAdmin data retrieved
 *       404:
 *         description: SuperAdmin not found
 */

router.get('/:id', superAdminController.getById);

export default router;
