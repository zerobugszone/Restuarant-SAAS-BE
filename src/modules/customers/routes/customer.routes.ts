import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { tenantResolver } from '@/core/middleware/tenantResolver.middleware';
import { validationMiddleware } from '@/core/middleware/validation.middleware';
import { CreateCustomerDto } from '../dto/createCustomer.dto';
import { UpdateCustomerDto } from '../dto/updateCustomer.dto';

const router = Router();
const controller = new CustomerController();

/**
 * @openapi
 * /api/v1/customers:
 *   get:
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     summary: List customers
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', authenticationMiddleware, tenantResolver, controller.list);
/**
 * @openapi
 * /api/v1/customers:
 *   post:
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     summary: Create customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCustomerDto'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticationMiddleware, tenantResolver, validationMiddleware(CreateCustomerDto), controller.create);
/**
 * @openapi
 * /api/v1/customers/{id}:
 *   get:
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     summary: Get customer
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:id', authenticationMiddleware, tenantResolver, controller.getById);
/**
 * @openapi
 * /api/v1/customers/{id}:
 *   put:
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     summary: Update customer
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
 *             $ref: '#/components/schemas/UpdateCustomerDto'
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', authenticationMiddleware, tenantResolver, validationMiddleware(UpdateCustomerDto), controller.update);

export default router;
