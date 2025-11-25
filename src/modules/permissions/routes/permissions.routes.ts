import { Router } from 'express';
import {
  createPermission,
  getPermissions,
  updatePermission,
  deletePermission,
} from '../controllers/permissions.controller';

const router = Router();

router.post('/', createPermission);
router.get('/', getPermissions);
router.put('/:id', updatePermission);
router.delete('/:id', deletePermission);

export default router;
