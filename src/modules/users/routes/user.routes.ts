import { Router } from 'express';
import { register, login, forgetPassword, changePassword } from '../controllers/user.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/change-password', changePassword);

export default router;
