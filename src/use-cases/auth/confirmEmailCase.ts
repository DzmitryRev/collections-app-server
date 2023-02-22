import { UserDtoType } from '../../models/user.model';
import tokenService from '../../services/token.service';
import userService from '../../services/user-service/user.service';

export async function confirmEmailCase(emailToken: string) {
  const refreshTokenDoc = tokenService.validateToken(emailToken, process.env.JWT_EMAIL_SECRET);
  await userService.confirmUserEmail((refreshTokenDoc.payload as UserDtoType).id);
}
