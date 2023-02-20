import UserModel from '../../models/user.model';

export async function getUserByEmail(email: string) {
  return UserModel.findOne({ email });
}

export async function getUserById(id: string) {
  return UserModel.findById(id);
}
