import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import catchAsync from '../../../shared/catchAsync';
import db from '../../../shared/db';
import pick from '../../../shared/pick';
import rollbackAsync from '../../../shared/rollbackAsync';
import sendResponse from '../../../shared/sendResponse';
import { songsFilterableFields, songsSearchableFields } from './song.constant';
import { ISongs } from './song.interface';

const insertIntoDB = rollbackAsync(async (req, res) => {
  const { title, duration, album_id } = req.body;

  const query = `
      INSERT INTO songs (title, duration, album_id) VALUES ($1, $2, $3) RETURNING *
    `;

  const result = await db.query(query, [title, duration, album_id]);

  sendResponse<ISongs>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'song created successfully',
    data: result.rows[0],
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const { searchTerm, ...filtersData } = pick(req.query, songsFilterableFields);
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  let query = `SELECT s.id, s.title, s.duration, s.created_at, s.updated_at, jsonb_agg(jsonb_build_object('id', alb.id, 'title', alb.title, 'genre', alb.genre, 'release_year', alb.release_year, 'created_at', alb.created_at, 'updated_at', alb.updated_at)) AS albums FROM songs AS s LEFT JOIN albums AS alb ON s.album_id = alb.id`;

  if (Object.keys(filtersData).length > 0 || searchTerm) {
    query += ` WHERE `;

    // dynamic searching
    if (searchTerm) {
      query += `(${songsSearchableFields.map(field => `${field} ILIKE '%${searchTerm}%'`).join(' OR ')})`;
    }
    if (searchTerm && Object.keys(filtersData).length > 0) {
      query += ` AND `;
    }
    // dynamic filtering with exact match
    if (Object.keys(filtersData).length > 0) {
      query += `${Object.keys(filtersData)
        .map(key => `LOWER(${key}) = LOWER('${filtersData[key]}')`)
        .join(` OR `)}`;
    }
  }

  query += ` GROUP BY s.id, alb.id`;

  query += ` ORDER BY ${sortBy} ${sortOrder}`;

  query += ` LIMIT ${limit} OFFSET ${skip}`;

  const result: ISongs[] = (await db.query(query))?.rows;

  const total = await db.query('SELECT COUNT(*) FROM songs');

  sendResponse<ISongs[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'songs fetched successfully',
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
  const { title } = req.body;
  const query = `UPDATE songs SET title = $1 WHERE id = $2 RETURNING *`;
  const result = await db.query(query, [title, id]);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'song updated successfully',
    data: result.rows[0],
  });
});

const deleteInDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM songs WHERE id = $1 RETURNING *`;
  const result = await db.query(query, [id]);
  if (!result.rows[0]) {
    sendResponse(res, {
      statusCode: httpStatus.NOT_FOUND,
      success: false,
      message: 'song does not exist',
    });
    return;
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'song deleted successfully',
    data: result.rows[0],
  });
});

export const SongController = {
  insertIntoDB,
  getAllFromDB,
  updateInDB,
  deleteInDB,
};
