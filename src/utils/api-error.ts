import { type ValidationError } from 'express-validator';
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from '../constants/status-codes-const';

class ApiError extends Error {
  errors: ValidationError[];

  status: number;

  constructor(
    message: string,
    status: number = INTERNAL_SERVER_ERROR,
    errors: ValidationError[] = [],
  ) {
    super(message);
    this.errors = errors;
    this.status = status;
  }

  static badRequest(message: string, errors: ValidationError[] = []) {
    return new ApiError(message, BAD_REQUEST, errors);
  }
}

export default ApiError;
