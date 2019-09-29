import faker from "faker";
import jwt from "jsonwebtoken";
import { hashPassword } from "./passwords";
import { getUserByEmail } from "./repositories/users";
import { createToken } from "./tokens";
import { generateIncorrectPassword } from "./utilities/testing";

jest.mock("./repositories/users", () => ({
  getUserByEmail: jest.fn()
}));

const INVALID_EMAIL_OR_PASSWORD_ERROR = new Error("Invalid email or password.");

describe("createToken", () => {
  it("throws error if user does not exist", async () => {
    await expect(
      createToken({
        email: faker.internet.email(),
        password: faker.internet.password()
      })
    ).rejects.toEqual(INVALID_EMAIL_OR_PASSWORD_ERROR);
  });

  describe("when user exists", () => {
    let id: string;
    let email: string;
    let password: string;
    let hashedPassword: string;

    beforeEach(async () => {
      id = faker.random.uuid();
      email = faker.internet.email();
      password = faker.internet.password();
      hashedPassword = await hashPassword(password);
      (getUserByEmail as any).mockReturnValueOnce({
        email,
        id,
        password: hashedPassword
      });
    });

    it("throws error if password is incorrect", async () => {
      await expect(
        createToken({
          email,
          password: generateIncorrectPassword(password)
        })
      ).rejects.toEqual(INVALID_EMAIL_OR_PASSWORD_ERROR);
    });

    describe("when password is correct", () => {
      let secret = "secret";
      let token: string;

      beforeEach(async () => {
        process.env.JWT_SECRET = secret;
        token = await createToken({ email, password });
      });

      it("returns a token", async () => {
        expect(token).toEqual(expect.any(String));
      });

      it("stores the user ID in the token", async () => {
        expect(jwt.verify(token, secret)).toEqual({
          iat: expect.any(Number),
          id
        });
      });
    });
  });
});
