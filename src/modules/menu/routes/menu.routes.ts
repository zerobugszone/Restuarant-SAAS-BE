import { Router } from 'express';
import { MenuController } from '../controllers/menu.controller';
import { CategoryController } from '../controllers/category.controller';
import { authenticationMiddleware } from '@/core/middleware/authentication.middleware';
import { tenantResolver } from '@/core/middleware/tenantResolver.middleware';
import { validationMiddleware } from '@/core/middleware/validation.middleware';
import { CreateMenuItemDto } from '../dto/createMenuItem.dto';
import { UpdateMenuItemDto } from '../dto/updateMenuItem.dto';
import { CreateCategoryDto } from '../dto/createCategory.dto';

const router = Router();
const menuController = new MenuController();
const categoryController = new CategoryController();

/**
 * @openapi
 * /api/v1/menu/items:
 *   get:
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     summary: List menu items
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/items', authenticationMiddleware, tenantResolver, menuController.list);
/**
 * @openapi
 * /api/v1/menu/items:
 *   post:
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     summary: Create menu item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMenuItemDto'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/items', authenticationMiddleware, tenantResolver, validationMiddleware(CreateMenuItemDto), menuController.create);
/**
 * @openapi
 * /api/v1/menu/items/{id}:
 *   put:
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     summary: Update menu item
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
 *             $ref: '#/components/schemas/UpdateMenuItemDto'
 *     responses:
 *       200:
 *         description: Updated
 */
router.put('/items/:id', authenticationMiddleware, tenantResolver, validationMiddleware(UpdateMenuItemDto), menuController.update);

/**
 * @openapi
 * /api/v1/menu/categories:
 *   get:
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     summary: List categories
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/categories', authenticationMiddleware, tenantResolver, categoryController.list);
/**
 * @openapi
 * /api/v1/menu/categories:
 *   post:
 *     tags: [Menu]
 *     security:
 *       - bearerAuth: []
 *     summary: Create category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCategoryDto'
 *     responses:
 *       201:
 *         description: Created
 */
router.post('/categories', authenticationMiddleware, tenantResolver, validationMiddleware(CreateCategoryDto), categoryController.create);

export default router;
