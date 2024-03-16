import Joi, { ObjectSchema } from 'joi';
import { IArtists } from './artists.interface';

const createArtistsJoiSchema: ObjectSchema<IArtists> = Joi.object({
  name: Joi.string(),
  album_id: Joi.number(),
});

const updateArtistsJoiSchema: ObjectSchema<IArtists> = Joi.object({
  name: Joi.string().message('name is required').optional(),
  album_id: Joi.number().optional(),
});

export const ArtistsValidation = {
  createArtistsJoiSchema,
  updateArtistsJoiSchema,
};
