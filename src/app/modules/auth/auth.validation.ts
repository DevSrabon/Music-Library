import Joi, { ObjectSchema } from 'joi';
import { Secret } from 'jsonwebtoken';
import { IUser } from '../user/user.interface';

const loginJoiSchema: ObjectSchema<Partial<IUser>> = Joi.object({
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

const refreshTokenJoiSchema: ObjectSchema<Secret> = Joi.object({
  cookie: Joi.object({
    refreshToken: Joi.string().required(),
  }),
});

export const AuthValidation = {
  loginJoiSchema,
  refreshTokenJoiSchema,
};
