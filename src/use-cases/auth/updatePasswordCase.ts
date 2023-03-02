import bcrypt from 'bcrypt';
import { UserDtoType } from '../../models/user.model';
import tokenService from '../../services/token.service';
import userService from '../../services/user-service/user.service';

export async function updatePasswordCase(passwordToken: string) {
  const refreshTokenDoc = tokenService.validateToken(
    passwordToken,
    process.env.JWT_PASSWORD_SECRET,
  );
  const newHashedPassword = await bcrypt.hash(refreshTokenDoc.payload.newPassword as string, 3);

  await userService.updateUser((refreshTokenDoc.payload.user as UserDtoType).id, {
    password: newHashedPassword,
  });
}
