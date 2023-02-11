import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { VALIDATION_ERROR } from '../../../constants/errors-messages-const';
import {
  EMAIL_IS_NOT_VALID,
  EMAIL_IS_EMPTY,
  NAME_IS_EMPTY,
  PASSWORD_IS_EMPTY,
  PASSWORD_TOO_SHORT_MIN_6,
} from '../../../constants/validation-const';
import ApiError from '../../../utils/api-error';

const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (errors && !errors.isEmpty()) {
    next(ApiError.badRequest(VALIDATION_ERROR, errors.array()));
  }
  next();
};

export const validateLogin = [
  check('email')
    .not()
    .isEmpty()
    .withMessage(EMAIL_IS_EMPTY)
    .isEmail()
    .withMessage(EMAIL_IS_NOT_VALID),
  check('password')
    .not()
    .isEmpty()
    .withMessage(PASSWORD_IS_EMPTY)
    .isLength({
      min: 5,
    })
    .withMessage(PASSWORD_TOO_SHORT_MIN_6),
  validateRequest,
];

export const validateRegister = [
  check('name').not().isEmpty().withMessage(NAME_IS_EMPTY),
  check('email')
    .not()
    .isEmpty()
    .withMessage(EMAIL_IS_EMPTY)
    .isEmail()
    .withMessage(EMAIL_IS_NOT_VALID),
  check('password')
    .not()
    .isEmpty()
    .withMessage(PASSWORD_IS_EMPTY)
    .isLength({
      min: 6,
    })
    .withMessage(PASSWORD_TOO_SHORT_MIN_6),
  validateRequest,
];
