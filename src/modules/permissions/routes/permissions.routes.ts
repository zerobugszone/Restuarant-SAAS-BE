import { Router } from 'express';
import { permissionsController } from '../controllers/permissions.controller';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { authorizeByRole } from '@/core/middleware/authorization.middleware';

const router = Router({ mergeParams: true });

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/permissions:
 *   post:
 *     tags: [Permissions]
 *     summary: Create a new permission
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
 *               - resource
 *               - action
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               resource:
 *                 type: string
 *                 description: Resource name (e.g., 'orders', 'menus')
 *               action:
 *                 type: string
 *                 description: Action type (e.g., 'create', 'read', 'update', 'delete')
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.post(
  '/',
  authenticationMiddleware,
  authorizeByRole(['admin']),
  permissionsController.createPermission.bind(permissionsController)
);

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/permissions:
 *   get:
 *     tags: [Permissions]
 *     summary: Get all permissions with pagination
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
 *         name: resource
 *         schema:
 *           type: string
 *         description: Filter by resource
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by permission name
 *     responses:
 *       200:
 *         description: List of permissions with pagination
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/',
  authenticationMiddleware,
  permissionsController.getPermissions.bind(permissionsController)
);

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/permissions/{permissionId}:
 *   get:
 *     tags: [Permissions]
 *     summary: Get a specific permission
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: permissionId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Permission details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Permission not found
 */
router.get(
  '/:permissionId',
  authenticationMiddleware,
  permissionsController.getPermissionById.bind(permissionsController)
);

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/permissions/{permissionId}:
 *   put:
 *     tags: [Permissions]
 *     summary: Update a permission
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: permissionId
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
 *         description: Permission updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 */
router.put(
  '/:permissionId',
  authenticationMiddleware,
  authorizeByRole(['admin']),
  permissionsController.updatePermission.bind(permissionsController)
);

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/permissions/{permissionId}:
 *   delete:
 *     tags: [Permissions]
 *     summary: Delete a permission
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: permissionId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 *       409:
 *         description: Conflict - Permission assigned to roles
 */
router.delete(
  '/:permissionId',
  authenticationMiddleware,
  authorizeByRole(['admin']),
  permissionsController.deletePermission.bind(permissionsController)
);

/**
 * @openapi
 * /api/v1/tenants/{tenantId}/permissions/resources/{resource}:
 *   get:
 *     tags: [Permissions]
 *     summary: Get all permissions for a specific resource
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *       - in: path
 *         name: resource
 *         schema:
 *           type: string
 *         description: Resource name (e.g., 'orders', 'menus')
 *     responses:
 *       200:
 *         description: List of permissions for the resource
 *       401:
 *         description: Unauthorized
 */
router.get(
  '/resources/:resource',
  authenticationMiddleware,
  permissionsController.getPermissionsByResource.bind(permissionsController)
);

export default router;
