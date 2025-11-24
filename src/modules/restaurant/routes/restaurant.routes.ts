import { Router } from 'express';
import { RestaurantController } from '../controllers/restaurant.controller';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { tenantResolver } from '@/core/middleware/tenantResolver.middleware';
import { validationMiddleware } from '@/core/middleware/validation.middleware';
import { UpdateRestaurantDto } from '../dto/updateRestaurant.dto';

const router = Router();
const controller = new RestaurantController();

/**
 * @openapi
 * /api/v1/restaurant:
 *   get:
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     summary: Get restaurant settings
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', authenticationMiddleware, tenantResolver, controller.getSettings);
/**
 * @openapi
 * /api/v1/restaurant:
 *   put:
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     summary: Update restaurant settings
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRestaurantDto'
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/', authenticationMiddleware, tenantResolver, validationMiddleware(UpdateRestaurantDto), controller.updateSettings);

export default router;
