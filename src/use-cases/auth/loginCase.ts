import tokenService from '../../services/token.service';
import userService from '../../services/user-service/user.service';

export async function loginCase(email: string, password: string) {
  const user = await userService.checkAccessToLogin(email);
  await userService.comparePassword(user.password, password);
  const tokens = tokenService.generateAuthTokens(user.transform());
  await tokenService.saveRefreshToken(user.id, tokens.refreshToken);
  return { user: user.transform(), ...tokens };
}
