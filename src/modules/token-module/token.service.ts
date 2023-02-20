import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import TokenModel from '../../models/token.model';
import ApiError from '../../utils/api-error.util';
import { USER_ALREADY_LOGGED_OUT, USER_UNAUTH } from '../../constants/errors.const';
import { generateToken, validateToken } from './token.helpers';
import { UserDtoType } from '../../models/user.model';

class TokenService {
  async checkTokenInDb(token: string) {
    const tokenInDb = await TokenModel.findOne({ refreshToken: token });
    if (!tokenInDb) throw new ApiError(USER_UNAUTH, httpStatus.UNAUTHORIZED);
  }

  generateVerifyEmailToken(payload: UserDtoType) {
    const verifyEmailToken = generateToken(payload, process.env.JWT_EMAIL_SECRET, '15m');
    return verifyEmailToken;
  }

  generateNewPasswordToken(payload: { user: UserDtoType; newPassword: string }) {
    const newPasswordToken = generateToken(payload, process.env.JWT_PASSWORD_SECRET, '15m');
    return newPasswordToken;
  }

  generateAuthTokens(payload: UserDtoType) {
    const accessToken = generateToken(payload, process.env.JWT_ACCESS_SECRET, '30m');
    const refreshToken = generateToken(payload, process.env.JWT_REFRESH_SECRET, '30d');
    return {
      accessToken,
      refreshToken,
    };
  }

  async removeToken(refreshToken: string) {
    const refreshTokenDoc = await TokenModel.findOneAndDelete({ refreshToken });
    if (!refreshTokenDoc) {
      throw new ApiError(USER_ALREADY_LOGGED_OUT, httpStatus.NOT_FOUND);
    }
  }

  async saveTokenInDb(userId: string, refreshToken: string) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }

  checkIsTokenValid(token: string, secret: string) {
    const tokenDoc = validateToken(token, secret);
    if (!tokenDoc) throw new ApiError(USER_UNAUTH, httpStatus.UNAUTHORIZED);
    return tokenDoc as JwtPayload;
  }
}

export const TokenServiceInstance = new TokenService();
