import { NextFunction, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import {
  EMAIL_IS_EMPTY,
  EMAIL_IS_NOT_VALID,
  NAME_IS_EMPTY,
  PASSWORD_IS_EMPTY,
  PASSWORD_TOO_SHORT_MIN_6,
  VALIDATION_ERROR,
} from '../constants/errors.const';
import ApiError from '../utils/api-error.util';
import { validateRequest } from './validationRequest';

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

export const validateResetPassword = [
  check('email')
    .not()
    .isEmpty()
    .withMessage(EMAIL_IS_EMPTY)
    .isEmail()
    .withMessage(EMAIL_IS_NOT_VALID),
  validateRequest,
];
