import faker from "faker";
import { User } from "../types";
import { createUser, deleteUser } from "./users";
import { Driver } from "neo4j-driver/types/v1";

let driver: Driver;

jest.mock("../neo4j", () => {
  return {
    createDriver: () => {
      driver = {
        close: jest.fn(),
        session: jest.fn()
      };
      return driver;
    }
  };
});

describe("createUser function", () => {
  let session: any;
  let name: string;
  let email: string;
  let password: string;
  let user: User;

  beforeEach(async () => {
    name = faker.name.findName();
    email = faker.internet.email();
    password = faker.internet.password();
    session = {
      close: jest.fn(),
      run: jest.fn()
    };
    (driver.session as any).mockReturnValueOnce(session);
    user = await createUser({ email, name, password });
  });

  it("returns a user", async () => {
    expect(user).toEqual({
      email,
      id: expect.any(String),
      name,
      password: expect.any(String)
    });
  });

  it("closes the session", () => {
    expect(session.close).toHaveBeenCalledTimes(1);
  });
});

describe("deleteUser function", () => {
  let session: any;

  beforeEach(async () => {
    const id = faker.random.uuid();
    session = {
      close: jest.fn(),
      run: jest.fn()
    };
    (driver.session as any).mockReturnValueOnce(session);
    await deleteUser({ id });
  });

  it("closes the session", () => {
    expect(session.close).toHaveBeenCalledTimes(1);
  });
});
