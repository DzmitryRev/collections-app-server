import { NextFunction, Request, Response } from 'express';
import { NO_ACCESS } from '../constants/errors.const';
import { UserDtoType } from '../models/user.model';
import userService from '../services/user-service/user.service';
import ApiError from '../utils/api-error.util';

export const getUserProfile = async (
  req: Request<{ userId: string }>,
  res: Response<UserDtoType>,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const user = await userService.getUserProfile(userId);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

export const updateUserBody = async (
  req: Request<{ userId: string }, {}, Partial<UserDtoType>>,
  res: Response<UserDtoType>,
  next: NextFunction,
) => {
  try {
    if (req.body?.email) {
      throw ApiError.badRequest(NO_ACCESS);
    }
    const user = await userService.updateUser(req.params.userId, req.body);
    res.json(user);
  } catch (e) {
    next(e);
  }
};
