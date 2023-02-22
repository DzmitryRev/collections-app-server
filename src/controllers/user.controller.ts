import { NextFunction, Request, Response } from 'express';
import { UserDtoType } from '../models/user.model';
import { getUserProfileCase, updateUserCase } from '../use-cases/profile';

export const getUserProfile = async (
  req: Request<{ userId: string }>,
  res: Response<UserDtoType>,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const user = await getUserProfileCase(userId);
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
    const user = await updateUserCase(req.params.userId, req.body);
    res.json(user);
  } catch (e) {
    next(e);
  }
};

export const updateUserAvatar = async (
  req: Request<{ userId: string }, {}, Pick<UserDtoType, 'avatar'>>,
  res: Response<UserDtoType>,
  next: NextFunction,
) => {
  try {
    const user = await updateUserCase(req.params.userId, req.body);
    res.json(user);
  } catch (e) {
    next(e);
  }
};
