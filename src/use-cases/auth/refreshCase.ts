import { UserDtoType } from '../../models/user.model';
import tokenService from '../../services/token.service';
import userService from '../../services/user-service/user.service';

export async function refreshCase(refreshToken: string) {
  const refreshTokenDoc = tokenService.validateToken(refreshToken, process.env.JWT_REFRESH_SECRET);
  await tokenService.getToken(refreshToken);
  const user = await userService.getUserProfile((refreshTokenDoc.payload as UserDtoType).id);
  const newTokens = tokenService.generateAuthTokens(user);
  await tokenService.saveRefreshToken(user.id, newTokens.refreshToken);
  return { user, ...newTokens };
}
