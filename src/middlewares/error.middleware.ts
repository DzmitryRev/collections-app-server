import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import ApiError from '../utils/api-error.util';

function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Unknown error' });
}

export default errorMiddleware;
