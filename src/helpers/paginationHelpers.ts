import { IPaginationOptions } from '../interfaces/pagination';

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: 'ASC' | 'DESC';
};

const calculatePagination = (options: IPaginationOptions): IOptionsResult => {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || 'created_at';
  const sortOrder = options.sortOrder || 'DESC';

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelpers = {
  calculatePagination,
};
