import { Router } from 'express';
import userServices from '../controllers/user.controller';
import { tenantResolver } from '@/core/middleware/tenantResolver.middleware';

const router = Router();

router.post('/register', tenantResolver, userServices.registerUser);

export default router;
