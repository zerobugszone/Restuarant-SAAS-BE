import { Request, Response } from 'express';
import { RolesRepository } from '../repositories/roles.repository';

export const createRole = async (req: Request, res: Response) => {
  const { tenantId, ...data } = req.body;
  const role = await RolesRepository.create(tenantId, data);
  res.status(201).json(role);
};

export const getRoles = async (req: Request, res: Response) => {
  const { tenantId } = req.query;
  const roles = await RolesRepository.getAll(tenantId as string);
  res.json(roles);
};

export const updateRole = async (req: Request, res: Response) => {
  const { tenantId, ...data } = req.body;
  const { id } = req.params;
  const role = await RolesRepository.update(tenantId, id, data);
  res.json(role);
};

export const deleteRole = async (req: Request, res: Response) => {
  const { tenantId } = req.body;
  const { id } = req.params;
  await RolesRepository.delete(tenantId, id);
  res.status(204).send();
};
