import tokenService from '../../services/token.service';

export async function logoutCase(refreshToken: string) {
  await tokenService.removeToken(refreshToken);
}
