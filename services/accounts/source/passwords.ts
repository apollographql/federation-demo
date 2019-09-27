import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const checkPassword = (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
}

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
}
