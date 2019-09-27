import jwt from "jsonwebtoken"
import { getUserByEmail } from "./neo4j";
import { checkPassword } from "./passwords";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const createToken = async ({ email, password }) => {
  const user = await getUserByEmail(email);
  if (user) {
    const isCorrectPassword = await checkPassword(password, user.password);
    if (isCorrectPassword) {
      return jwt.sign({ id: user.id }, JWT_SECRET);
    }
  }
  throw new Error("Invalid email or password.");
}
