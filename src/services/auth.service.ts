import httpStatus from 'http-status';
import {
  INVALID_LINK,
  INVALID_PASSWORD,
  USER_BLOCKED,
  USER_NOT_CONFIRMED,
  USER_NOT_FOUND,
  USER_UNAUTH,
  VERIFICATION_FAILED,
} from '../constants/errors.const';
import { UserDtoType } from '../models/user.model';
import ApiError from '../utils/auth-error.util';
import HashService from './hash.service';
import TokenService from './token.service';
import UserService from './user.service';

class AuthService {
  async loginUserWithEmailAndPassword(email: string, password: string) {
    const user = await UserService.getUserByEmail(email);
    if (!user) throw ApiError.badRequest(USER_NOT_FOUND);
    if (user.isBlocked) throw ApiError.badRequest(USER_BLOCKED);
    if (!user.isConfirmed) throw ApiError.badRequest(USER_NOT_CONFIRMED);
    const isPassEquals = await HashService.compareHash(user.password, password);
    if (!isPassEquals) throw ApiError.badRequest(INVALID_PASSWORD);
    return user.transform();
  }

  async logout(refreshToken: string) {
    await TokenService.removeToken(refreshToken);
  }

  async refreshAuth(refreshToken: string | undefined) {
    try {
      if (!refreshToken) throw new ApiError(USER_UNAUTH, httpStatus.UNAUTHORIZED);
      const refreshTokenDoc = TokenService.validateToken(
        refreshToken,
        process.env.JWT_REFRESH_SECRET,
      );
      if (!refreshTokenDoc) throw new ApiError(USER_UNAUTH, httpStatus.UNAUTHORIZED);
      const user = await UserService.getUserById((refreshTokenDoc.payload as UserDtoType).id);
      if (!user) throw ApiError.badRequest(USER_NOT_FOUND);
      return { userId: user.id, ...TokenService.generateAuthTokens(user.transform()) };
    } catch (error) {
      throw new ApiError(USER_UNAUTH, httpStatus.UNAUTHORIZED);
    }
  }

  async verifyEmail(verifyEmailToken: string) {
    try {
      const verifyEmailTokenDoc = await TokenService.validateToken(
        verifyEmailToken,
        process.env.JWT_EMAIL_SECRET,
      );
      if (!verifyEmailTokenDoc) throw new ApiError(USER_UNAUTH, httpStatus.UNAUTHORIZED);
      const user = await UserService.getUserById((verifyEmailTokenDoc.payload as UserDtoType).id);
      if (!user || user.isConfirmed) throw new ApiError(INVALID_LINK, httpStatus.UNAUTHORIZED);
      user.isConfirmed = true;
      await user.save();
    } catch (error) {
      throw new ApiError(VERIFICATION_FAILED, httpStatus.UNAUTHORIZED);
    }
  }
}

export default new AuthService();
