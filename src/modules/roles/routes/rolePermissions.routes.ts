import { Router } from 'express';
import {
  assignPermission,
  getRolePermissions,
  removePermission,
} from '../controllers/rolePermissions.controller';

const router = Router();

router.post('/assign', assignPermission);
router.get('/:roleId', getRolePermissions);
router.delete('/remove', removePermission);

export default router;
