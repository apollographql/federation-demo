import { hashPassword, checkPassword } from "./passwords";
import { generateIncorrectPassword } from "./utilities/testing";

const passwords = [
  {
    originalPassword: "password1",
    hashedPassword:
      "$2a$10$ke69ClJotgz6DDVu4jWS9eoqLE4LjFyr76aDrtX3x5sZw8bCK3VVy"
  },
  {
    originalPassword: "password2",
    hashedPassword:
      "$2a$10$3vaQDhPyzhlUKJQal0fpi.6ssY69k6/xjzhnI81rrS7P3TO9.tCa."
  },
  {
    originalPassword: "password3",
    hashedPassword:
      "$2a$10$6Cm4AIfsLNYd8E90XU656OwspBu09kiuLP0fds.eUwwTRU4KC2D2e"
  }
];

describe("checkPassword function", () => {
  passwords.forEach(({ originalPassword, hashedPassword }) => {
    const incorrectPassword = generateIncorrectPassword(originalPassword);

    describe(`for hash "${hashedPassword}"`, () => {
      describe("checkPassword function", () => {
        it("accepts the correct password", async () => {
          await expect(
            checkPassword(originalPassword, hashedPassword)
          ).resolves.toBe(true);
        });

        it("rejects an incorrect password", async () => {
          await expect(
            checkPassword(incorrectPassword, hashedPassword)
          ).resolves.toBe(false);
        });
      });
    });
  });
});

describe("hashPassword function", () => {
  passwords.forEach(({ originalPassword }) => {
    describe(`for password "${originalPassword}"`, () => {
      it("generates a valid hash", async () => {
        const hashedPassword = await hashPassword(originalPassword);
        await expect(
          checkPassword(originalPassword, hashedPassword)
        ).resolves.toBe(true);
      });
    });
  });
});
