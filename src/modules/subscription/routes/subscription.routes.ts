import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { authorize } from '@/core/middleware/authorization.middleware';
import { validationMiddleware } from '@/core/middleware/validation.middleware';
import { CreateSubscriptionDto } from '../dto/createSubscription.dto';
import { UpdateSubscriptionDto } from '../dto/updateSubscription.dto';

const router = Router();
const controller = new SubscriptionController();

/**
 * @openapi
 * /api/v1/admin/subscriptions:
 *   post:
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     summary: Create subscription for tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SubscriptionCreate'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/', authenticationMiddleware, authorize(['admin']), validationMiddleware(CreateSubscriptionDto), controller.create);

/**
 * @openapi
 * /api/v1/admin/subscriptions/{tenantId}:
 *   get:
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     summary: List subscriptions for tenant
 *     parameters:
 *       - in: path
 *         name: tenantId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/:tenantId', authenticationMiddleware, authorize(['admin']), controller.listByTenant);

/**
 * @openapi
 * /api/v1/admin/subscriptions/{id}:
 *   put:
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     summary: Update subscription
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', authenticationMiddleware, authorize(['admin']), validationMiddleware(UpdateSubscriptionDto), controller.update);

export default router;
