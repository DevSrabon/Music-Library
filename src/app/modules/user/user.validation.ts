import Joi, { ObjectSchema } from 'joi';
import { IUser } from './user.interface';

const createUserJoiSchema: ObjectSchema<IUser> = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .message('Username is required')
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })
    .message('Email is required')
    .required(),
  password: Joi.string()
    .min(6)
    .max(30)
    .messages({
      'string.min': 'Password is too short',
      'string.max': 'Password is too long',
      'any.required': 'Password is required',
    })
    .required(),
});

const updateUserJoiSchema: ObjectSchema<IUser> = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).optional(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
    })

    .optional(),
  password: Joi.string().min(6).max(30).optional(),
});

export const UserValidation = {
  createUserJoiSchema,
  updateUserJoiSchema,
};
