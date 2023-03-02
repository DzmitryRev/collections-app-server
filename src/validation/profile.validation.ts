import { Request } from 'express';
import { check } from 'express-validator';
import { NAME_IS_EMPTY } from '../constants/errors.const';
import { validateRequest } from './validationRequest';

export const validateUpdateUserBody = [
  check('name')
    .if((req: Request) => req.body.name)
    .not()
    .isEmpty()
    .withMessage(NAME_IS_EMPTY),
  validateRequest,
];
