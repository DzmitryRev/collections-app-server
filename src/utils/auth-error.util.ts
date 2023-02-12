import { type ValidationError } from 'express-validator';
import httpStatus from 'http-status';

class ApiError extends Error {
  errors: ValidationError[];

  status: number;

  constructor(
    message: string,
    status: number = httpStatus.INTERNAL_SERVER_ERROR,
    errors: ValidationError[] = [],
  ) {
    super(message);
    this.errors = errors;
    this.status = status;
  }

  static badRequest(message: string, errors: ValidationError[] = []) {
    return new ApiError(message, httpStatus.BAD_REQUEST, errors);
  }
}

export default ApiError;
