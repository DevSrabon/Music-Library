import { NextFunction, Request, RequestHandler, Response } from 'express';
import db from './db';

/**
 * Executes a request handler function within a transaction and rolls back the transaction in case of an error.
 *
 * @param fn The request handler function to be executed.
 * @returns Void
 */
const rollbackAsync =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      await fn(req, res, next);

      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      next(error);
    } finally {
      client.release();
    }
  };

export default rollbackAsync;
