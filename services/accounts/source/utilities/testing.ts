import faker from "faker";

export const generateIncorrectPassword = (correctPassword: string) => {
  const notCorrectPassword = `^(?!${correctPassword}$).*$`;
  return faker.internet.password(undefined, undefined, notCorrectPassword);
};
