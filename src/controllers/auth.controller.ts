import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import shortid from 'shortid';
import { COOKIE_AGE, REFRESH_COOKIE_NAME } from '../constants/cookie.const';
import { USER_UNAUTH } from '../constants/errors.const';
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
import ApiError from '../utils/api-error.util';
import { HashServiceInstance } from '../modules/hash-module';
import { UserServiceInstance } from '../modules/user-module';
import { TokenServiceInstance } from '../modules/token-module';
import { MailServiceInstance } from '../modules/mail-module';

export const register = async (
  req: Request<{}, {}, { name: string; email: string; password: string }>,
  res: Response<SuccessMessage>,
  next: NextFunction,
) => {
  try {
    const { email, name, password } = req.body;
    const hashedPasword = await HashServiceInstance.hashPassword(password);
    const user = await UserServiceInstance.createUser(email, name, hashedPasword);
    const verifyEmailToken = TokenServiceInstance.generateVerifyEmailToken(user.transform());
    await MailServiceInstance.sendVerificationEmail(email, verifyEmailToken);
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
    const user = await UserServiceInstance.checkAccessToLogin(email);
    await HashServiceInstance.checkPassword(user.password, password);
    const tokens = TokenServiceInstance.generateAuthTokens(user.transform());
    await TokenServiceInstance.saveTokenInDb(user.id, tokens.refreshToken);
    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, {
      maxAge: COOKIE_AGE,
      httpOnly: true,
    });
    res.send({ user: user.transform(), accessToken: tokens.accessToken });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: Request, res: Response<SuccessMessage>, next: NextFunction) => {
  try {
    await TokenServiceInstance.removeToken(req.cookies[REFRESH_COOKIE_NAME]);
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
    if (!refreshToken) throw new ApiError(USER_UNAUTH, httpStatus.UNAUTHORIZED);
    const refreshTokenDoc = TokenServiceInstance.checkIsTokenValid(
      refreshToken,
      process.env.JWT_REFRESH_SECRET,
    );
    await TokenServiceInstance.checkTokenInDb(refreshToken);
    const user = await UserServiceInstance.checkUserInDbById(
      (refreshTokenDoc.payload as UserDtoType).id,
    );
    const newTokens = TokenServiceInstance.generateAuthTokens(user.transform());
    await TokenServiceInstance.saveTokenInDb(user.id, newTokens.refreshToken);
    res.cookie(REFRESH_COOKIE_NAME, newTokens.refreshToken, {
      maxAge: COOKIE_AGE,
      httpOnly: true,
    });
    res.json({ user: user.transform(), accessToken: newTokens.accessToken });
  } catch (e) {
    next(e);
  }
};

export const verifyEmail = async (
  req: Request<{ token: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshTokenDoc = TokenServiceInstance.checkIsTokenValid(
      req.params.token,
      process.env.JWT_EMAIL_SECRET,
    );
    await UserServiceInstance.confirmUserEmail((refreshTokenDoc.payload as UserDtoType).id);
    res.redirect(`${process.env.CLIENT_URL}${SUCCESS_CONFIRM_URL}${ACCESS_QUERY}`);
  } catch (e) {
    res.redirect(`${process.env.CLIENT_URL}${ERROR_CONFIRM_URL}${ACCESS_QUERY}`);
  }
};

export const checkAccessToChangingPassword = async (
  req: Request<{}, {}, { email: string }>,
  res: Response<SuccessMessage>,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const user = await UserServiceInstance.checkAccessToLogin(email);
    const newPassword = shortid.generate();
    const verifyEmailToken = TokenServiceInstance.generateNewPasswordToken({
      user: user.transform(),
      newPassword,
    });
    await MailServiceInstance.sendNewPasswordEmail(email, verifyEmailToken, newPassword);
    res.json(new SuccessMessage(MESSAGE_SENDED));
  } catch (e) {
    next(e);
  }
};

export const confirmNewPassword = async (
  req: Request<{ token: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const refreshTokenDoc = TokenServiceInstance.checkIsTokenValid(
      req.params.token,
      process.env.JWT_PASSWORD_SECRET,
    );
    const newHashedPassword = await HashServiceInstance.hashPassword(
      refreshTokenDoc.payload.newPassword as string,
    );
    await UserServiceInstance.changeUserPassword(
      (refreshTokenDoc.payload.user as UserDtoType).id,
      newHashedPassword,
    );
    res.redirect(`${process.env.CLIENT_URL}${PASSWORD_CHANGED}${ACCESS_QUERY}`);
  } catch (e) {
    res.redirect(`${process.env.CLIENT_URL}${ERROR_CONFIRM_URL}${ACCESS_QUERY}`);
  }
};
