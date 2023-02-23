import { UserDtoType } from '../../models/user.model';
import userService from '../../services/user-service/user.service';

export async function updateUserCase(id: string, body: Partial<UserDtoType>) {
  const user = await userService.findAndUpdateById(id, body);
  return user.transform();
}
