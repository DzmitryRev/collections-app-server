import { Request } from 'express';
import { check } from 'express-validator';
import { NAME_IS_EMPTY, UNSUPPORTED_THEME } from '../constants/errors.const';
import { AVAILABLE_THEMES } from '../models/collection.model';
import { validateRequest } from './validationRequest';

export const validateCreateCollectionBody = [
  check('name').not().isEmpty().withMessage(NAME_IS_EMPTY),
  check('theme')
    .not()
    .isEmpty()
    .custom((value) => AVAILABLE_THEMES.includes(value))
    .withMessage(UNSUPPORTED_THEME),
  validateRequest,
];

export const validateUpdateCollectionBody = [
  check('name')
    .if((req: Request) => req.body.name)
    .not()
    .isEmpty()
    .withMessage(NAME_IS_EMPTY),
  check('theme')
    .if((req: Request) => req.body.theme)
    .not()
    .isEmpty()
    .custom((value) => AVAILABLE_THEMES.includes(value))
    .withMessage(UNSUPPORTED_THEME),
  validateRequest,
];
