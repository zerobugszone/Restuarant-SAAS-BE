import { Router } from 'express';
import { QrController } from '../controllers/qr.controller';
import { UpdateQrDto } from '../dto/updateQr.dto';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { tenantResolver } from '@/core/middleware/tenantResolver.middleware';

const router = Router();
const controller = new QrController();

/**
 * @openapi
 * /api/v1/qr/table:
 *   post:
 *     tags: [QR]
 *     security:
 *       - bearerAuth: []
 *     summary: Generate QR code for table
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tableId
 *             properties:
 *               tableId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/table', authenticationMiddleware, tenantResolver, controller.generateForTable);
/**
 * @openapi
 * /api/v1/qr/menu:
 *   post:
 *     tags: [QR]
 *     security:
 *       - bearerAuth: []
 *     summary: Generate QR code for menu section
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - menuSectionId
 *             properties:
 *               menuSectionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/menu', authenticationMiddleware, tenantResolver, controller.generateForMenu);
/**
 * @openapi
 * /api/v1/qr/{id}:
 *   get:
 *     tags: [QR]
 *     security:
 *       - bearerAuth: []
 *     summary: Get QR code by id
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
 * /api/v1/qr/{id}:
 *   put:
 *     tags: [QR]
 *     security:
 *       - bearerAuth: []
 *     summary: Update QR code
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
 *             $ref: '#/components/schemas/UpdateQrDto'
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/:id', authenticationMiddleware, tenantResolver, controller.update);

export default router;
