import jwt from "jsonwebtoken";
import { getUserByEmail } from "./neo4j";
import { checkPassword } from "./passwords";

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
