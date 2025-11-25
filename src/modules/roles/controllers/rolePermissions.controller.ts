import { Request, Response } from 'express';
import { RolePermissionsRepository } from '../repositories/rolePermissions.repository';

export const assignPermission = async (req: Request, res: Response) => {
  const { tenantId, roleId, permissionId } = req.body;
  const result = await RolePermissionsRepository.assign(tenantId, roleId, permissionId);
  res.status(201).json(result);
};

export const getRolePermissions = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { roleId } = req.params;
  const permissions = await RolePermissionsRepository.getByRole(tenantId as string, roleId);
  res.json(permissions);
};

export const removePermission = async (req: Request, res: Response) => {
  const { tenantId, roleId, permissionId } = req.body;
  await RolePermissionsRepository.remove(tenantId, roleId, permissionId);
  res.status(204).send();
};
