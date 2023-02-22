import shortid from 'shortid';
import mailService from '../../services/mail-service/mail.service';
import tokenService from '../../services/token.service';
import userService from '../../services/user-service/user.service';

export async function sendNewPasswordCase(email: string) {
  const user = await userService.checkAccessToLogin(email);
  const newPassword = shortid.generate();
  const verifyEmailToken = tokenService.generatePasswordToken({
    user: user.transform(),
    newPassword,
  });
  await mailService.sendNewPasswordEmail(email, verifyEmailToken, newPassword);
}
