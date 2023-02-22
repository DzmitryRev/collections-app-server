import { Request } from 'express';
import { UserDtoType } from './models/user.model';

declare global {
  namespace Express {
    interface Request {
      user?: UserDtoType;
    }
  }
}
