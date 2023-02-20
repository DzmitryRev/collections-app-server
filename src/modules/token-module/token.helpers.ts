import jwt from 'jsonwebtoken';
import { UserDtoType } from '../../models/user.model';

export type NewPasswordTokenType = {
  user: UserDtoType;
  newPassword: string;
};

export type AvailableTokenPayloadTypes = UserDtoType | NewPasswordTokenType;

export function generateToken(
  payload: AvailableTokenPayloadTypes,
  sercret: string,
  expiresIn: string,
) {
  const verifyEmailToken = jwt.sign({ payload }, sercret, {
    expiresIn,
  });
  return verifyEmailToken;
}

export function validateToken(token: string, secret: string) {
  try {
    const userData = jwt.verify(token, secret);
    return userData;
  } catch (e) {
    return null;
  }
}
