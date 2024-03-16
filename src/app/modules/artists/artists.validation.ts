import Joi, { ObjectSchema } from 'joi';
import { IArtists } from './artists.interface';

const createArtistsJoiSchema: ObjectSchema<IArtists> = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Name must be a string',
    'any.required': 'Name is required',
  }),
  album_id: Joi.number().integer().positive().required().messages({
    'number.base': 'Album ID must be a number',
    'number.empty': 'Album ID cannot be empty',
    'number.integer': 'Album ID must be an integer',
    'number.positive': 'Album ID must be a positive number',
    'any.required': 'Album ID is required',
  }),
});

const updateArtistsJoiSchema: ObjectSchema<IArtists> = Joi.object({
  name: Joi.string().message('name is required').optional(),
  album_id: Joi.number().integer().positive().optional(),
});

export const ArtistsValidation = {
  createArtistsJoiSchema,
  updateArtistsJoiSchema,
};
