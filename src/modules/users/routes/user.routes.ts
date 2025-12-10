import { Router } from 'express';
import userServices from '../controllers/user.controller';
import { tenantResolver } from '@/core/middleware/tenantResolver.middleware';

const router = Router();

router.get('/', tenantResolver, userServices.getUsers);

router.post('/register', tenantResolver, userServices.registerUser);

/**
 * User login
 * POST /api/users/login
 * Body: { email, password }
 * Note: tenantResolver extracts subdomain/tenantId from request
 * User login is now simplified - no need to pass tenantId in body
 */
router.post('/login', tenantResolver, userServices.login);

/**
 * Create superadmin user for tenant
 * POST /api/users/superadmin
 * Body: { tenantId, email, password }
 * Note: No tenantResolver - tenantId comes from body
 */
router.post('/superadmin', userServices.createSuperAdmin);

router.get('/email/:email', tenantResolver, userServices.findUserByEmail);

export default router;
