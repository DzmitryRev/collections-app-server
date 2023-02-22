import { check } from 'express-validator';
import { NAME_IS_EMPTY } from '../constants/errors.const';
import { validateRequest } from './validationRequest';

export const validateUpdateUserBody = [
  check('name').not().isEmpty().withMessage(NAME_IS_EMPTY),
  validateRequest,
];
