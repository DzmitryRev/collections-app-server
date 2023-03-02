import bcrypt from 'bcrypt';
import mailService from '../../services/mail-service/mail.service';
import tokenService from '../../services/token.service';
import userService from '../../services/user-service/user.service';

export async function registrationCase(email: string, name: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 3);
  const user = await userService.createUser(email, name, hashedPassword);
  const verifyEmailToken = tokenService.generateVerifyEmailToken(user);
  await mailService.sendVerificationEmail(email, verifyEmailToken);
}
