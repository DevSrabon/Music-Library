import { NextFunction, Request, RequestHandler, Response } from 'express';

/**
 * Executes a request handler function asynchronously and catches any errors, forwarding them to the next middleware.
 *
 * @param fn The request handler function to be executed.
 * @returns void
 */
const catchAsync =
  (fn: RequestHandler) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };

export default catchAsync;
