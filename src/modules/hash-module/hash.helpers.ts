import bcrypt from 'bcrypt';

export async function compareHash(userPassword: string, passwordFromReq: string) {
  const isPassEquals = await bcrypt.compare(passwordFromReq, userPassword);
  return isPassEquals;
}
