import { NextFunction, Request, Response } from 'express';
import { NO_ACCESS } from '../constants/errors.const';
import ApiError from '../utils/api-error.util';

export function ownerMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { userId } = req.params;
    if (!req.user || req.user.id !== userId) {
      next(ApiError.badRequest(NO_ACCESS));
    }
    next();
  } catch (e) {
    next(e);
  }
}
