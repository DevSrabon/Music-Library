import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import catchAsync from '../../../shared/catchAsync';
import db from '../../../shared/db';
import pick from '../../../shared/pick';
import rollbackAsync from '../../../shared/rollbackAsync';
import sendResponse from '../../../shared/sendResponse';
import {
  artistsFilterableFields,
  artistsSearchableFields,
} from './artists.constant';
import { IArtists } from './artists.interface';

const insertIntoDB = rollbackAsync(async (req, res) => {
  const { name, album_id } = req.body;
  const artQuery = `SELECT * FROM artists WHERE name = $1`;
  const isArtistExist = await db.query(artQuery, [name]);
  if (isArtistExist.rows.length > 0) {
    const albumQuery = `INSERT INTO album_artists (album_id, artist_id) VALUES ($1, $2) RETURNING *`;
    const result = await db.query(albumQuery, [
      album_id,
      isArtistExist.rows[0].id,
    ]);
    sendResponse<IArtists>(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Artist created successfully',
      data: result.rows[0],
    });
  }
  const query = `
      WITH inserted_artist AS (
        INSERT INTO artists (name) VALUES ($1) RETURNING id
      )
      INSERT INTO album_artists (album_id, artist_id)
      SELECT $2, id FROM inserted_artist
      RETURNING (SELECT * FROM inserted_artist), album_id, artist_id
    `;

  const result = await db.query(query, [name, album_id]);

  sendResponse<IArtists>(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Artist created successfully',
    data: result.rows[0],
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const { searchTerm, ...filtersData } = pick(
    req.query,
    artistsFilterableFields,
  );
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  let query = `SELECT art.id, art.name, art.created_at, art.updated_at, jsonb_agg(jsonb_build_object('id', alb.id, 'title', alb.title, 'genre', alb.genre, 'release_year', alb.release_year, 'created_at', alb.created_at, 'updated_at', alb.updated_at)) AS albums FROM artists art LEFT JOIN album_artists aa ON art.id = aa.artist_id LEFT JOIN albums alb ON aa.album_id = alb.id`;

  if (Object.keys(filtersData).length > 0 || searchTerm) {
    query += ` WHERE `;

    //dynamic searching
    if (searchTerm) {
      query += `(${artistsSearchableFields.map(field => `${field} ILIKE '%${searchTerm}%'`).join(' OR ')})`;
    }
    if (searchTerm && Object.keys(filtersData).length > 0) {
      query += ` AND `;
    }
    //dynamic filtering with exact match
    if (Object.keys(filtersData).length > 0) {
      query += `${Object.keys(filtersData)
        .map(key => `LOWER(${key}) = LOWER('${filtersData[key]}')`)
        .join(` OR `)}`;
    }
  }

  query += ` GROUP BY art.id`;

  query += ` ORDER BY ${sortBy} ${sortOrder}`;

  query += ` LIMIT ${limit} OFFSET ${skip}`;

  const result: IArtists[] = (await db.query(query))?.rows;

  const total = await db.query('SELECT COUNT(*) FROM Artists');

  sendResponse<IArtists[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Artists fetched successfully',
    meta: {
      page,
      limit,
      total: total?.rows[0].count,
    },
    data: result,
  });
});

const updateInDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const query = `UPDATE artists SET name = $1 WHERE id = $2 RETURNING *`;
  const result = await db.query(query, [name, id]);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Artist updated successfully',
    data: result.rows[0],
  });
});

const deleteInDB = rollbackAsync(async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM artists WHERE id = $1 RETURNING *`;
  const result = await db.query(query, [id]);
  const albArtQuery = `DELETE FROM album_artists WHERE artist_id = $1`;
  await db.query(albArtQuery, [id]);
  if (!result.rows[0]) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'Artist does not exist',
    });
    return;
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Artist deleted successfully',
    data: result.rows[0],
  });
});

export const ArtistsController = {
  insertIntoDB,
  getAllFromDB,
  updateInDB,
  deleteInDB,
};
