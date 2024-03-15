import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import { paginationFields } from '../../../constants/pagination';
import { paginationHelpers } from '../../../helpers/paginationHelpers';
import catchAsync from '../../../shared/catchAsync';
import db from '../../../shared/db';
import pick from '../../../shared/pick';
import sendResponse from '../../../shared/sendResponse';
import { userFilterableFields, userSearchableFields } from './user.constant';
import { IUser } from './user.interface';

const insertIntoDB = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;
  const hashPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const query = `INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at, updated_at`;
  const result: IUser = (await db.query(query, [username, email, hashPassword]))
    ?.rows[0];
  if (result) {
    result.password = undefined;
  }
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const paginationOptions = pick(req.query, paginationFields);
  const { searchTerm, ...filtersData } = pick(req.query, userFilterableFields);
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(paginationOptions);

  let query = `SELECT id, username, email FROM users`;

  if (Object.keys(filtersData).length > 0 || searchTerm) {
    query += ` WHERE `;

    //dynamic searching
    if (searchTerm) {
      query += `(${userSearchableFields.map(field => `${field} ILIKE '%${searchTerm}%'`).join(' OR ')})`;
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

  const result: IUser[] = (await db.query(query))?.rows;

  const total = await db.query('SELECT COUNT(*) FROM users');

  sendResponse<IUser[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User fetched successfully',
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
  const updateData = req.body;
  const updateValues = Object.values(updateData);

  //   dynamic update query
  const updateColumns = Object.keys(updateData)
    .map((key, index) => `${key} = $${index + 1}`)
    .join(', ')
    .concat(', updated_at = NOW()');

  const query = `UPDATE users SET ${updateColumns} WHERE id = ${id} RETURNING id, username, email, created_at, updated_at`;

  const result: IUser = (await db.query(query, [...updateValues])).rows[0];

  sendResponse<Partial<IUser>>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User updated successfully',
    data: result,
  });
});

const deleteInDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM users WHERE id = $1 RETURNING id, username, email, created_at, updated_at`;
  const result: IUser = (await db.query(query, [id])).rows[0];
  sendResponse<IUser>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

export const UserController = {
  insertIntoDB,
  getAllFromDB,
  updateInDB,
  deleteInDB,
};
