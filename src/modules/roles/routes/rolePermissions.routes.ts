import { Router } from 'express';
import { rolePermissionsController } from '../controllers/rolePermissions.controller';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { authorizeByRole } from '@/core/middleware/authorization.middleware';

const router = Router({ mergeParams: true });

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/roles/{roleId}/permissions:
 *   post:
 *     tags: [RolePermissions]
 *     summary: Assign permissions to a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: roleId
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
 *               - permissionIds
 *             properties:
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Permissions assigned to role successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.post(
  '/',
  authenticationMiddleware,
  authorizeByRole(['admin']),
  rolePermissionsController.assignPermissions.bind(rolePermissionsController)
);

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/roles/{roleId}/permissions:
 *   get:
 *     tags: [RolePermissions]
 *     summary: Get all permissions for a role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: roleId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of permissions for the role
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 */
router.get(
  '/',
  authenticationMiddleware,
  rolePermissionsController.getRolePermissions.bind(rolePermissionsController)
);

export default router;
