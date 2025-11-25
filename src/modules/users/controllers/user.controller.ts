import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { OTPService } from '../services/otp.service';

export const register = async (req: Request, res: Response) => {
  const user = await UserService.register(req.body);
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await UserService.login(email, password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  res.json(user);
};

export const forgetPassword = async (req: Request, res: Response) => {
  // Generate OTP, send to user
};

export const changePassword = async (req: Request, res: Response) => {
  // Verify OTP, change password
};
