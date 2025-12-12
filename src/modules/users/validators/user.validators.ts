import { body } from 'express-validator';
import { forbidExtraFields } from '@/core/helper/validation_helper';
import emojiRegex from 'emoji-regex';

const createSuperadminSchema = [
  forbidExtraFields(['email', 'password', 'tenantId']),
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
        throw new Error('Email cannot contain emoji characters');
      }
      return true;
    })
    .bail(),

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

  body('tenantId').trim().notEmpty().withMessage('Tenant ID is required').bail(),
];

export { createSuperadminSchema };
