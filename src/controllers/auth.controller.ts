import { NextFunction, Request, Response } from 'express';
import { COOKIE_AGE, REFRESH_COOKIE_NAME } from '../constants/cookie.const';
import {
  MESSAGE_SENDED,
  SUCCESSFUL_LOGOUT,
  SUCCESSFUL_REGISTR,
} from '../constants/success-messages.const';
import {
  ACCESS_QUERY,
  ERROR_CONFIRM_URL,
  PASSWORD_CHANGED,
  SUCCESS_CONFIRM_URL,
} from '../constants/client-paths.const';
import { UserDtoType } from '../models/user.model';
import SuccessMessage from '../utils/success-message.util';
import {
  confirmEmailCase,
  loginCase,
  logoutCase,
  refreshCase,
  registrationCase,
  sendNewPasswordCase,
  updatePasswordCase,
} from '../use-cases/auth';

export const registration = async (
  req: Request<{}, {}, { name: string; email: string; password: string }>,
  res: Response<SuccessMessage>,
  next: NextFunction,
) => {
  try {
    const { email, name, password } = req.body;
    await registrationCase(email, name, password);
    res.json(new SuccessMessage(SUCCESSFUL_REGISTR));
  } catch (e) {
    next(e);
  }
};

export const login = async (
  req: Request<{}, {}, { email: string; password: string }>,
  res: Response<{ user: UserDtoType; accessToken: string }>,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const userAndTokens = await loginCase(email, password);
    res.cookie(REFRESH_COOKIE_NAME, userAndTokens.refreshToken, {
      maxAge: COOKIE_AGE,
      httpOnly: true,
    });
    res.send({ user: userAndTokens.user, accessToken: userAndTokens.accessToken });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: Request, res: Response<SuccessMessage>, next: NextFunction) => {
  try {
    await logoutCase(req.cookies[REFRESH_COOKIE_NAME]);
    res.clearCookie(REFRESH_COOKIE_NAME);
    res.json(new SuccessMessage(SUCCESSFUL_LOGOUT));
  } catch (e) {
    next(e);
  }
};

export const refreshTokens = async (
  req: Request,
  res: Response<{ user: UserDtoType; accessToken: string }>,
  next: NextFunction,
) => {
  try {
    const refreshToken = req.cookies[REFRESH_COOKIE_NAME];
    const userAndTokens = await refreshCase(refreshToken);
    res.cookie(REFRESH_COOKIE_NAME, userAndTokens.refreshToken, {
      maxAge: COOKIE_AGE,
      httpOnly: true,
    });
    res.json({ user: userAndTokens.user, accessToken: userAndTokens.accessToken });
  } catch (e) {
    next(e);
  }
};

export const confirmEmail = async (
  req: Request<{ token: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await confirmEmailCase(req.params.token);
    res.redirect(`${process.env.CLIENT_URL}${SUCCESS_CONFIRM_URL}${ACCESS_QUERY}`);
  } catch (e) {
    res.redirect(`${process.env.CLIENT_URL}${ERROR_CONFIRM_URL}${ACCESS_QUERY}`);
  }
};

export const sendNewPassword = async (
  req: Request<{}, {}, { email: string }>,
  res: Response<SuccessMessage>,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    await sendNewPasswordCase(email);
    res.json(new SuccessMessage(MESSAGE_SENDED));
  } catch (e) {
    next(e);
  }
};

export const changePassword = async (
  req: Request<{ token: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    await updatePasswordCase(req.params.token);
    res.redirect(`${process.env.CLIENT_URL}${PASSWORD_CHANGED}${ACCESS_QUERY}`);
  } catch (e) {
    res.redirect(`${process.env.CLIENT_URL}${ERROR_CONFIRM_URL}${ACCESS_QUERY}`);
  }
};
