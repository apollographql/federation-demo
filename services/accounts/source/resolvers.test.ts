import faker from "faker";
import { createUser, getUserByID } from "./repositories/users";
import resolvers from "./resolvers";
import { createToken } from "./tokens";

jest.mock("./repositories/users", () => ({
  createUser: jest.fn(),
  getUserByID: jest.fn()
}));

jest.mock("./tokens", () => ({
  createToken: jest.fn()
}));

beforeEach(() => {
  jest.resetAllMocks();
});

describe("createToken mutation resolver", () => {
  it("calls createToken function", async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    await resolvers.Mutation.createToken(undefined, {
      email,
      password
    });
    expect(createToken).toHaveBeenCalledTimes(1);
    expect(createToken).toBeCalledWith({
      email,
      password
    });
  });
});

describe("createUser mutation resolver", () => {
  it("calls createUser function", async () => {
    const name = faker.name.findName();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await resolvers.Mutation.createUser(undefined, {
      email,
      name,
      password
    });
    expect(createUser).toHaveBeenCalledTimes(1);
    expect(createUser).toBeCalledWith({
      email,
      name,
      password
    });
  });
});

describe("me query resolver", () => {
  it("calls getUserByID function", async () => {
    const context = {
      userID: faker.random.uuid()
    };
    await resolvers.Query.me(undefined, {}, context);
    expect(getUserByID).toHaveBeenCalledTimes(1);
    expect(getUserByID).toBeCalledWith(context.userID);
  });
});

describe("User reference resolver", () => {
  it("calls getUserByID function", async () => {
    const id = faker.random.uuid();
    await resolvers.User.__resolveReference({ id });
    expect(getUserByID).toHaveBeenCalledTimes(1);
    expect(getUserByID).toBeCalledWith(id);
  });
});
