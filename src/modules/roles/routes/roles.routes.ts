import { Router } from 'express';
import { createRole, getRoles, updateRole, deleteRole } from '../controllers/roles.controller';

const router = Router();

/**
 * @openapi
 * /api/v1/roles:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
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
 *         description: Role created
 */
router.post('/', createRole);

/**
 * @openapi
 * /api/v1/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles
 *     parameters:
 *       - in: query
 *         name: tenantId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: List of roles
 */
router.get('/', getRoles);

/**
 * @openapi
 * /api/v1/roles/{id}:
 *   put:
 *     tags: [Roles]
 *     summary: Update a role
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
 *         description: Role updated
 */
router.put('/:id', updateRole);

/**
 * @openapi
 * /api/v1/roles/{id}:
 *   delete:
 *     tags: [Roles]
 *     summary: Delete a role
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
 *         description: Role deleted
 */
router.delete('/:id', deleteRole);

export default router;
