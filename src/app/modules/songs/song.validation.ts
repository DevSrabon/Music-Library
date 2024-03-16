import Joi, { ObjectSchema } from 'joi';
import { ISongs } from './song.interface';

const createSongJoiSchema: ObjectSchema<ISongs> = Joi.object({
  title: Joi.string().max(100).required().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title must not exceed {#limit} characters',
    'any.required': 'Title is required',
  }),
  duration: Joi.string().required().messages({
    'any.required': 'Duration is required',
  }),
  album_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Album ID must be a number',
    'number.empty': 'Album ID cannot be empty',
    'number.integer': 'Album ID must be an integer',
    'number.positive': 'Album ID must be a positive number',
    'any.required': 'Album ID is required',
  }),
});

const updateSongJoiSchema: ObjectSchema<ISongs> = Joi.object({
  title: Joi.string().max(100).optional().messages({
    'string.base': 'Title must be a string',
    'string.empty': 'Title cannot be empty',
    'string.max': 'Title must not exceed {#limit} characters',
  }),
  duration: Joi.string().optional().messages({
    'string.base': 'Duration must be a string',
    'string.empty': 'Duration cannot be empty',
  }),
  album_id: Joi.number().integer().positive().optional().messages({
    'number.base': 'Album ID must be a number',
    'number.empty': 'Album ID cannot be empty',
    'number.integer': 'Album ID must be an integer',
    'number.positive': 'Album ID must be a positive number',
  }),
});

export const SongValidation = {
  createSongJoiSchema,
  updateSongJoiSchema,
};
