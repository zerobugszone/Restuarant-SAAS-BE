import { body } from 'express-validator';
import { forbidExtraFields } from '@/core/helper/validation_helper';
import emojiRegex from 'emoji-regex';
import { superadmins } from '@/core/database/schemas/master/superadmin.schema';
import { masterDb } from '@/core/database/masterConnection';
import { eq } from 'drizzle-orm';

const emailUniqueCheck = async (email: string, { req }: any) => {
  const existingUser = await masterDb
    .select()
    .from(superadmins)
    .where(eq(superadmins.email, email))
    .limit(1);
  if (existingUser && existingUser.length > 0) {
    throw new Error('Email already exists');
  }
};

export const createSuperadminSchema = [
  forbidExtraFields(['email', 'password', 'name', 'role']),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email format')
    .bail()
    .custom(value => {
      const regex = emojiRegex();
      if (regex.test(value)) {
        throw new Error('Title cannot contain emoji characters');
      }
      return true;
    })
    .bail()
    .custom(emailUniqueCheck),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .bail()
    .isLength({ min: 6, max: 15 })
    .withMessage('Password must be at least 6 characters long and not exceed 15 characters')
    .bail()
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .bail()
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one symbol')
    .bail()
    .custom(value => {
      const regex = emojiRegex();
      if (regex.test(value)) {
        throw new Error('Title cannot contain emoji characters');
      }
      return true;
    }),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .bail()
    .isString()
    .withMessage('Name must be a string')
    .bail()
    .isLength({ min: 3, max: 30 })
    .withMessage('Name must be between 3 and 30 characters')
    .custom(value => {
      const regex = emojiRegex();
      if (regex.test(value)) {
        throw new Error('Title cannot contain emoji characters');
      }
      return true;
    }),
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .bail()
    .isString()
    .withMessage('Role must be a string')
    .bail()
    .isLength({ max: 20 })
    .withMessage('Role must not exceed 20 characters')
    .bail()
    .custom(value => {
      const regex = emojiRegex();
      if (regex.test(value)) {
        throw new Error('Title cannot contain emoji characters');
      }
      return true;
    }),
];

export const loginSuperAdminValidator = [
  forbidExtraFields(['email', 'password']),
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Invalid email address'),
  body('password').notEmpty().withMessage('Password is required'),
];
