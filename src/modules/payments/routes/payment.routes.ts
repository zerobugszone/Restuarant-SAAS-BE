import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { tenantResolver } from '@/core/middleware/tenantResolver.middleware';
import { validationMiddleware } from '@/core/middleware/validation.middleware';
import { ProcessPaymentDto } from '../dto/processPayment.dto';

const router = Router();
const controller = new PaymentController();

/**
 * @openapi
 * /api/v1/payments:
 *   post:
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     summary: Process a payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessPaymentDto'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticationMiddleware, tenantResolver, validationMiddleware(ProcessPaymentDto), controller.process);
/**
 * @openapi
 * /api/v1/payments/{id}:
 *   get:
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     summary: Get payment by id
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
 * /api/v1/payments/order/{orderId}:
 *   get:
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     summary: List payments for order
 *     parameters:
 *       - in: path
 *         name: orderId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/order/:orderId', authenticationMiddleware, tenantResolver, controller.listByOrder);

export default router;
