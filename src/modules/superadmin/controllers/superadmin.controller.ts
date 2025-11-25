import { Request, Response } from 'express';
import { SuperAdminService } from '../services/superadmin.service';

export const registerSuperAdmin = async (req: Request, res: Response) => {
  const admin = await SuperAdminService.register(req.body);
  res.status(201).json(admin);
};

export const loginSuperAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = await SuperAdminService.login(email, password);
  if (!admin) return res.status(401).json({ message: 'Invalid credentials' });
  res.json(admin);
};
