import { NextFunction, Request, Response } from 'express';
import { HAVENT_ACCESS } from '../constants/errors.const';
import ApiError from '../utils/api-error.util';

export function adminMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user || !req.user.isAdmin) {
      next(ApiError.badRequest(HAVENT_ACCESS));
    }
    next();
  } catch (e) {
    next(e);
  }
}
