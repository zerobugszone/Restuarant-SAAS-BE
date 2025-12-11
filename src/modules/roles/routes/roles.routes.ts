import { Router } from 'express';
import { rolesController } from '../controllers/roles.controller';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { authorizeByRole } from '@/core/middleware/authorization.middleware';

const router = Router({ mergeParams: true });

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Role name
 *               description:
 *                 type: string
 *                 description: Role description
 *     responses:
 *       201:
 *         description: Role created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  authenticationMiddleware,
  authorizeByRole(['admin']),
  rolesController.createRole.bind(rolesController)
);

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles with pagination
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by role name
 *     responses:
 *       200:
 *         description: List of roles with pagination
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticationMiddleware, rolesController.getRoles.bind(rolesController));

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/roles/{roleId}:
 *   get:
 *     tags: [Roles]
 *     summary: Get a specific role with permissions
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
 *         description: Role details with permissions
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Role not found
 */
router.get('/:roleId', authenticationMiddleware, rolesController.getRoleById.bind(rolesController));

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/roles/{roleId}:
 *   put:
 *     tags: [Roles]
 *     summary: Update a role
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
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.put(
  '/:roleId',
  authenticationMiddleware,
  authorizeByRole(['admin']),
  rolesController.updateRole.bind(rolesController)
);

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/roles/{roleId}:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete a role
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
 *         description: Role deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 *       409:
 *         description: Conflict - Role has assigned users
 */
router.delete(
  '/:roleId',
  authenticationMiddleware,
  authorizeByRole(['admin']),
  rolesController.deleteRole.bind(rolesController)
);

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/roles/{roleId}/permissions:
 *   post:
 *     tags: [Roles]
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
 *         description: Permissions assigned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.post(
  '/:roleId/permissions',
  authenticationMiddleware,
  authorizeByRole(['admin']),
  rolesController.assignPermissionsToRole.bind(rolesController)
);

export default router;
