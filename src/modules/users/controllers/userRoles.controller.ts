import { Request, Response } from 'express';
import { UserRolesRepository } from '../repositories/userRoles.repository';

export const assignRole = async (req: Request, res: Response) => {
  const { tenantId, userId, roleId } = req.body;
  const result = await UserRolesRepository.assign(tenantId, userId, roleId);
  res.status(201).json(result);
};

export const getUserRoles = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const { userId } = req.params;
  const roles = await UserRolesRepository.getByUser(tenantId as string, userId);
  res.json(roles);
};

export const removeRole = async (req: Request, res: Response) => {
  const { tenantId, userId, roleId } = req.body;
  await UserRolesRepository.remove(tenantId, userId, roleId);
  res.status(204).send();
};
