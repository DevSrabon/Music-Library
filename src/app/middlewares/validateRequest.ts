import { NextFunction, Request, Response } from 'express';
import { ObjectSchema } from 'joi';

const validateRequest =
  (schema: ObjectSchema) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.validateAsync(req.body);
      return next();
    } catch (error) {
      console.log({ error });
      next(error);
    }
  };

export default validateRequest;
