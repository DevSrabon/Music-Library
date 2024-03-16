import httpStatus from 'http-status';
import { paginationFields } from '../../../constants/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import catchAsync from '../../../shared/catchAsync';
import db from '../../../shared/db';
import pick from '../../../shared/pick';
import rollbackAsync from '../../../shared/rollbackAsync';
import sendResponse from '../../../shared/sendResponse';
import { albumFilterableFields, albumSearchableFields } from './album.constant';
import { IAlbum } from './album.interface';

const insertIntoDB = rollbackAsync(async (req, res) => {
  const { artists_name, title, genre, release_year } = req.body;

  const artistQuery = 'SELECT * FROM artists WHERE name = $1';
  const artistResult = await db.query(artistQuery, [artists_name]);

  let artistId;
  let artistName;
  if (artistResult.rows.length === 0) {
    const insertArtistQuery =
      'INSERT INTO artists (name) VALUES ($1) RETURNING *';
    const insertArtistResult = await db.query(insertArtistQuery, [
      artists_name,
    ]);
    artistId = insertArtistResult.rows[0].id;
    artistName = insertArtistResult.rows[0].name;
  } else {
    artistId = artistResult.rows[0].id;
    artistName = artistResult.rows[0].name;
  }

  const insertAlbumQuery = `
    INSERT INTO albums (title, genre, release_year)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const albumResult = await db.query(insertAlbumQuery, [
    title,
    genre,
    release_year,
  ]);
  const album = albumResult.rows[0];

  const insertAssociationQuery = `
    INSERT INTO album_artists (album_id, artist_id)
    VALUES ($1, $2)
  `;
  await db.query(insertAssociationQuery, [album.id, artistId]);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Album created successfully',
    data: { artist_id: artistId, artist_name: artistName, ...album },
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const { searchTerm, ...filtersData } = pick(req.query, albumFilterableFields);
  console.log('🚀 ~ getAllFromDB ~ searchTerm:', searchTerm);
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  let query = `
    SELECT
      alb.id,
      alb.title,
      alb.genre,
      alb.release_year,
      alb.created_at,
      alb.updated_at,
      jsonb_agg(jsonb_build_object('id', art.id, 'name', art.name)) AS artists
    FROM
      albums alb
    JOIN
      album_artists aa ON alb.id = aa.album_id
    JOIN
      artists art ON aa.artist_id = art.id
  `;

  if (searchTerm || Object.keys(filtersData).length > 0) {
    query += ` WHERE `;

    if (searchTerm) {
      query += `(${albumSearchableFields.map(field => `${field} ILIKE '%${searchTerm}%'`).join(' OR ')})`;
    }

    if (searchTerm && Object.keys(filtersData).length > 0) {
      query += ` AND `;
    }
    if (Object.keys(filtersData).length > 0) {
      query += `${Object.keys(filtersData)
        .map(key => `${key}='${filtersData[key]}'`)
        .join(` OR `)}`;
    }
  }
  query += ` GROUP BY alb.id`;
  query += ` ORDER BY ${sortBy} ${sortOrder}`;
  query += ` LIMIT ${limit} OFFSET ${skip}`;

  const result: IAlbum[] = (await db.query(query))?.rows;

  const total = await db.query('SELECT COUNT(*) FROM Albums');

  sendResponse<IAlbum[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Album fetched successfully',
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
  const { artists_name, updateData } = req.body;
  const updateValues = Object.values(updateData);

  //   dynamic update query
  const updateColumns = Object.keys(updateData)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ')
    .concat(', updated_at = NOW()');

  const query = `UPDATE Albums SET ${updateColumns} WHERE id = ${id} RETURNING *`;

  const result: IAlbum = (await db.query(query, [...updateValues])).rows[0];

  if (!artists_name) {
    sendResponse<IAlbum | null>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Album updated successfully',
      data: { ...result, artists_name },
    });
    return;
  }

  const artistQuery = 'SELECT * FROM artists WHERE name = $1';
  const artistResult = await db.query(artistQuery, [artists_name]);

  let artistId;
  if (artistResult.rows.length === 0) {
    const insertArtistQuery =
      'INSERT INTO artists (name) VALUES ($1) RETURNING id';
    const insertArtistResult = await db.query(insertArtistQuery, [
      artists_name,
    ]);
    artistId = insertArtistResult.rows[0].id;
    result.artists_name = insertArtistResult.rows[0].name;
  } else {
    artistId = artistResult.rows[0].id;
    result.artists_name = artistResult.rows[0].name;
  }

  const updateArtistNameQuery = `
    UPDATE album_artists
    SET artist_id = $1
    WHERE album_id = $2
  `;
  await db.query(updateArtistNameQuery, [artistId, id]);
  sendResponse<Partial<IAlbum>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Album updated successfully',
    data: result,
  });
});

const deleteInDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM Albums WHERE id = $1 RETURNING id, title, genre, created_at, updated_at`;
  const result: IAlbum = (await db.query(query, [id])).rows[0];
  sendResponse<IAlbum>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Album deleted successfully',
    data: result,
  });
});

export const AlbumController = {
  insertIntoDB,
  getAllFromDB,
  updateInDB,
  deleteInDB,
};
