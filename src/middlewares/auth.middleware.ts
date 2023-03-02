/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { REFRESH_COOKIE_NAME } from '../constants/cookie.const';
import { UNAUTHORIZED } from '../constants/errors.const';
import UserModel, { UserDtoType } from '../models/user.model';
import tokenService from '../services/token.service';
import ApiError from '../utils/api-error.util';

export interface AuthRequest extends Request {
  user: UserDtoType;
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(new ApiError(UNAUTHORIZED, httpStatus.UNAUTHORIZED));
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return next(new ApiError(UNAUTHORIZED, httpStatus.UNAUTHORIZED));
    }

    const userData = tokenService.validateToken(accessToken, process.env.JWT_ACCESS_SECRET);
    if (!userData) {
      return next(new ApiError(UNAUTHORIZED, httpStatus.UNAUTHORIZED));
    }
    const userDto = userData.payload as UserDtoType;
    const user = await UserModel.getUserById(userDto.id);
    if (!user || user.isBlocked) {
      res.clearCookie(REFRESH_COOKIE_NAME);
      return next(new ApiError(UNAUTHORIZED, httpStatus.UNAUTHORIZED));
    }
    req.user = userDto;
    next();
  } catch (e) {
    return next(new ApiError(UNAUTHORIZED, httpStatus.UNAUTHORIZED));
  }
}
