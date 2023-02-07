/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextFunction, type Request, type Response } from 'express';
import { INTERNAL_SERVER_ERROR } from '../constants/status-codes-const';
import ApiError from '../utils/api-error';

function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(INTERNAL_SERVER_ERROR).json({ message: 'Unknown error' });
}

export default errorMiddleware;
