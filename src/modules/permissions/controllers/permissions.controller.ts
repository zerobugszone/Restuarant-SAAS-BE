import { Request, Response } from 'express';
import { PermissionsRepository } from '../repositories/permissions.repository';

export const createPermission = async (req: Request, res: Response) => {
  const { tenantId, ...data } = req.body;
  const permission = await PermissionsRepository.create(tenantId, data);
  res.status(201).json(permission);
};

export const getPermissions = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const permissions = await PermissionsRepository.getAll(tenantId as string);
  res.json(permissions);
};

export const updatePermission = async (req: Request, res: Response) => {
  const { tenantId, ...data } = req.body;
  const { id } = req.params;
  const permission = await PermissionsRepository.update(tenantId, id, data);
  res.json(permission);
};

export const deletePermission = async (req: Request, res: Response) => {
  const { tenantId } = req.body;
  const { id } = req.params;
  await PermissionsRepository.delete(tenantId, id);
  res.status(204).send();
};
