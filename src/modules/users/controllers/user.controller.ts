import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { OTPService } from '../services/otp.service';

export const register = async (req: Request, res: Response) => {
  const { tenantId, ...data } = req.body;
  const user = await UserService.register(tenantId, data);
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { tenantId, email, password } = req.body;
  const user = await UserService.login(tenantId, email, password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json(user);
};

export const forgetPassword = async (req: Request, res: Response) => {
  // Generate OTP, send to user
};

export const changePassword = async (req: Request, res: Response) => {
  // Verify OTP, change password
};
