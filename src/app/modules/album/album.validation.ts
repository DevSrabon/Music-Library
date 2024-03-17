import Joi, { ObjectSchema } from 'joi';
import { IAlbum } from './album.interface';

const createAlbumJoiSchema: ObjectSchema<IAlbum> = Joi.object({
  artists_name: Joi.string()
    .min(3)
    .max(100)
    .messages({
      'string.min': 'artists_name is too short',
      'string.max': 'artists_name is too long',
      'any.required': 'artists_name is required',
    })
    .required(),
  title: Joi.string()
    .min(3)
    .max(100)
    .messages({
      'string.min': 'title is too short',
      'string.max': 'title is too long',
      'any.required': 'title is required',
    })
    .required(),
  genre: Joi.string()
    .messages({
      'string.min': 'genre is too short',
      'string.max': 'genre is too long',
      'any.required': 'genre is required',
    })
    .required(),
  release_year: Joi.string()
    .length(4)
    .messages({
      'string.length': 'release year must be exactly 4 characters long',
      'any.required': 'release year is required',
    })
    .required(),
});

const updateAlbumJoiSchema: ObjectSchema<IAlbum> = Joi.object({
  artists_name: Joi.string().min(3).max(100).optional(),
  title: Joi.string().min(3).max(100).optional(),
  genre: Joi.string().optional(),
  release_year: Joi.string()
    .length(4)
    .messages({
      'string.length': 'release year must be exactly 4 characters long',
      'any.required': 'release year is required',
    })
    .optional(),
});

export const AlbumValidation = {
  createAlbumJoiSchema,
  updateAlbumJoiSchema,
};
