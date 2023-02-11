import { check } from 'express-validator';
import {
  EMAIL_IS_NOT_VALID,
  IS_EMPTY,
  PASSWORD_TOO_SHORT_MIN_6,
} from '../../../constants/validation-const';

export const validateLogin = [
  check('email').not().isEmpty().withMessage(IS_EMPTY)
    .isEmail()
    .withMessage(EMAIL_IS_NOT_VALID),
  check('password')
    .not()
    .isEmpty()
    .withMessage(IS_EMPTY)
    .isLength({
      min: 5,
    })
    .withMessage(PASSWORD_TOO_SHORT_MIN_6),
];

export const validateRegister = [
  check('name').not().isEmpty().withMessage(IS_EMPTY),
  check('email').not().isEmpty().withMessage(IS_EMPTY)
    .isEmail()
    .withMessage(EMAIL_IS_NOT_VALID),
  check('password')
    .not()
    .isEmpty()
    .withMessage(IS_EMPTY)
    .isLength({
      min: 5,
    })
    .withMessage(PASSWORD_TOO_SHORT_MIN_6),
];
