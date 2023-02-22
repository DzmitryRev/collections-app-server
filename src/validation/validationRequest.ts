import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { VALIDATION_ERROR } from '../constants/errors.const';
import ApiError from '../utils/api-error.util';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors && !errors.isEmpty()) {
    next(ApiError.badRequest(VALIDATION_ERROR, errors.array()));
  }
  next();
};
