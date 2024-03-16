import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import catchAsync from '../../../shared/catchAsync';
import db from '../../../shared/db';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import {
  artistsFilterableFields,
  artistsSearchableFields,
} from './artists.constant';
import { IArtists } from './artists.interface';

const insertIntoDB = catchAsync(async (req, res) => {
  const { name, album_id } = req.body;

  const query = `INSERT INTO artists (name) VALUES ($1) RETURNING *`;
  let result;
  result = (await db.query(query, [name])).rows[0];
  const query2 = `INSERT INTO album_artists (album_id, artist_id) VALUES ($1, $2) RETURNING *`;
  result = (await db.query(query2, [album_id, result.id])).rows[0];
  sendResponse<IArtists>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Artists created successfully',
    data: result,
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

  let query = `SELECT * FROM Aatists`;

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
        .map(key => `${key}='${filtersData[key]}'`)
        .join(` OR `)}`;
    }
  }

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

const deleteInDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM artists WHERE id = $1 RETURNING *`;
  const result = await db.query(query, [id]);
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
