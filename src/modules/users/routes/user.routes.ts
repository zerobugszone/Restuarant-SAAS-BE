import { Router } from 'express';
import userServices from '../controllers/user.controller';
import { tenantResolver } from '@/core/middleware/tenantResolver.middleware';

const router = Router();

router.get('/', tenantResolver, userServices.getUsers);

router.post('/register', tenantResolver, userServices.registerUser);

/**
 * Create superadmin user for tenant
 * POST /api/users/superadmin
 * Body: { email, password }
 */
router.post('/superadmin', tenantResolver, userServices.createSuperAdmin);

router.get('/email/:email', tenantResolver, userServices.findUserByEmail);

export default router;
