import { Router } from 'express';
import tenantController from '../controllers/tenant.controller';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { authorize } from '@/core/middleware/authorization.middleware';
import { validationMiddleware } from '@/core/middleware/validation.middleware';
import { CreateTenantDto } from '../dto/createTenant.dto';
import { UpdateTenantDto } from '../dto/updateTenant.dto';

const router = Router();

router.get('/', tenantController.getAllTenants);

/**
 * @openapi
 * /api/v1/admin/tenants:
 *   post:
 *     tags: [Tenant Management]
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTenantDto'
 *     responses:
 *       201:
 *         description: Tenant created
 */
router.post('/', authenticationMiddleware, authorize(['admin']), tenantController.create);

/**
 * @openapi
 * /api/v1/admin/tenants:
 *   get:
 *     tags: [Tenant Management]
 *     security:
 *       - bearerAuth: []
 *     summary: List all tenants
 *     responses:
 *       200:
 *         description: OK
 */
// router.get('/', authenticationMiddleware, authorize(['admin']), controller.list);

/**
 * @openapi
 * /api/v1/admin/tenants/{id}:
 *   put:
 *     tags: [Tenant Management]
 *     security:
 *       - bearerAuth: []
 *     summary: Update tenant information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTenantDto'
 *     responses:
 *       200:
 *         description: Updated
 */
// router.put('/:id', authenticationMiddleware, authorize(['admin']), validationMiddleware(UpdateTenantDto), controller.update);

export default router;
