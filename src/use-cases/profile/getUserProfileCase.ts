import userService from '../../services/user-service/user.service';

export async function getUserProfileCase(id: string) {
  const user = await userService.getUserById(id);
  return user.transform();
}
