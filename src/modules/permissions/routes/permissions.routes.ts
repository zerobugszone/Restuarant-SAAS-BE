import { Router } from 'express';
import {
  createPermission,
  getPermissions,
  updatePermission,
  deletePermission,
} from '../controllers/permissions.controller';

const router = Router();

/**
 * @openapi
 * /api/v1/permissions:
 *   post:
 *     tags: [Permissions]
 *     summary: Create a new permission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenantId
 *               - name
 *             properties:
 *               tenantId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Permission created
 */
router.post('/', createPermission);

/**
 * @openapi
 * /api/v1/permissions:
 *   get:
 *     tags: [Permissions]
 *     summary: Get all permissions
 *     parameters:
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of permissions
 */
router.get('/', getPermissions);

/**
 * @openapi
 * /api/v1/permissions/{id}:
 *   put:
 *     tags: [Permissions]
 *     summary: Update a permission
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenantId
 *             properties:
 *               tenantId:
 *                 type: string
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission updated
 */
router.put('/:id', updatePermission);

/**
 * @openapi
 * /api/v1/permissions/{id}:
 *   delete:
 *     tags: [Permissions]
 *     summary: Delete a permission
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenantId
 *             properties:
 *               tenantId:
 *                 type: string
 *     responses:
 *       204:
 *         description: Permission deleted
 */
router.delete('/:id', deletePermission);

export default router;
