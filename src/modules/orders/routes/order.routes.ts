import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { tenantResolver } from '@/core/middleware/tenantResolver.middleware';
import { validationMiddleware } from '@/core/middleware/validation.middleware';
import { CreateOrderDto } from '../dto/createOrder.dto';
import { UpdateOrderDto } from '../dto/updateOrder.dto';

const router = Router();
const controller = new OrderController();

/**
 * @openapi
 * /api/v1/orders:
 *   post:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Create an order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderDto'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticationMiddleware, tenantResolver, validationMiddleware(CreateOrderDto), controller.create);
/**
 * @openapi
 * /api/v1/orders:
 *   get:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: List orders for tenant
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', authenticationMiddleware, tenantResolver, controller.list);
/**
 * @openapi
 * /api/v1/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Get order by id
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
 * /api/v1/orders/{id}:
 *   put:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Update order
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
 *             $ref: '#/components/schemas/UpdateOrderDto'
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', authenticationMiddleware, tenantResolver, validationMiddleware(UpdateOrderDto), controller.update);
/**
 * @openapi
 * /api/v1/orders/{id}/status:
 *   patch:
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     summary: Update order status
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
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, canceled]
 *     responses:
 *       200:
 *         description: Updated
 */
router.patch('/:id/status', authenticationMiddleware, tenantResolver, controller.updateStatus);

export default router;
