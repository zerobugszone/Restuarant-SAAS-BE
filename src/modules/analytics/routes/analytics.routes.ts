import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { tenantResolver } from '@/core/middleware/tenantResolver.middleware';

const router = Router();
const controller = new AnalyticsController();

/**
 * @openapi
 * /api/v1/analytics/sales:
 *   get:
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     summary: Get sales report
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/sales', authenticationMiddleware, tenantResolver, controller.salesReport);
/**
 * @openapi
 * /api/v1/analytics/popular-items:
 *   get:
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     summary: Get popular items
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/popular-items', authenticationMiddleware, tenantResolver, controller.popularItems);
/**
 * @openapi
 * /api/v1/analytics/staff-performance:
 *   get:
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     summary: Get staff performance report
 *     responses:
 *       200:
 *         description: OK
 */
router.get(
  '/staff-performance',
  authenticationMiddleware,
  tenantResolver,
  controller.staffPerformance
);
/**
 * @openapi
 * /api/v1/analytics/customer-insights:
 *   get:
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     summary: Get customer insights
 *     responses:
 *       200:
 *         description: OK
 */
router.get(
  '/customer-insights',
  authenticationMiddleware,
  tenantResolver,
  controller.customerInsights
);

export default router;
