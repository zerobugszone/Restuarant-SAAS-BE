import { Router } from 'express';
import userServices from '../controllers/user.controller';
import { tenantResolver } from '@/core/middleware/tenantResolver.middleware';

const router = Router();

router.get('/', tenantResolver, userServices.getUsers);

router.post('/register', tenantResolver, userServices.registerUser);
router.get('/email/:email', tenantResolver, userServices.findUserByEmail);

export default router;
