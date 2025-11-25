import { Router } from 'express';
import {
  assignPermission,
  getRolePermissions,
  removePermission,
} from '../controllers/rolePermissions.controller';

const router = Router();

/**
 * @openapi
 * /api/v1/role-permissions/assign:
 *   post:
 *     tags: [RolePermissions]
 *     summary: Assign a permission to a role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenantId
 *               - roleId
 *               - permissionId
 *             properties:
 *               tenantId:
 *                 type: string
 *               roleId:
 *                 type: string
 *               permissionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Permission assigned to role
 */
router.post('/assign', assignPermission);

/**
 * @openapi
 * /api/v1/role-permissions/{roleId}:
 *   get:
 *     tags: [RolePermissions]
 *     summary: Get permissions for a role
 *     parameters:
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of permissions for the role
 */
router.get('/:roleId', getRolePermissions);

/**
 * @openapi
 * /api/v1/role-permissions/remove:
 *   delete:
 *     tags: [RolePermissions]
 *     summary: Remove a permission from a role
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tenantId
 *               - roleId
 *               - permissionId
 *             properties:
 *               tenantId:
 *                 type: string
 *               roleId:
 *                 type: string
 *               permissionId:
 *                 type: string
 *     responses:
 *       204:
 *         description: Permission removed from role
 */
router.delete('/remove', removePermission);

export default router;
