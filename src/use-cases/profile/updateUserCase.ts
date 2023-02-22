import { UserDtoType } from '../../models/user.model';
import tokenService from '../../services/token.service';
import userService from '../../services/user-service/user.service';

export async function updateUserCase(id: string, body: Partial<UserDtoType>) {
  const user = await userService.findAndUpdateById(id, body);
  if (user.isBlocked) {
    await tokenService.removeTokenByUserId(user.id);
  }
  return user.transform();
}
