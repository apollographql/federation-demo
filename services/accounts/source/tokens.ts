import jwt from "jsonwebtoken";
import { checkPassword } from "./passwords";
import { getUserByEmail } from "./repositories/users";

export const createToken = async ({ email, password }) => {
  const { JWT_SECRET = "secret" } = process.env;
  const user = await getUserByEmail(email);
  if (user) {
    const isCorrectPassword = await checkPassword(password, user.password);
    if (isCorrectPassword) {
      return jwt.sign({ id: user.id }, JWT_SECRET);
    }
  }
  throw new Error("Invalid email or password.");
};
