import { Request, Response, NextFunction } from 'express';
import { ZodType, ZodError } from 'zod';

export const validate = (schema: ZodType) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({
        status: 'fail',
        errors: error.issues.map((err) => ({
          field: err.path[1],
          message: err.message,
        })),
      });
      return;
    }
    next(error);
  }
};