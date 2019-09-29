import faker from "faker";
import { Driver } from "neo4j-driver/types/v1";
import { User } from "../types";
import { createUser, deleteUser, getUserByEmail, getUserByID } from "./users";

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

describe("getUserByEmail function", () => {
  let email: string;
  let user: User | null;
  let session: any;

  beforeEach(async () => {
    email = faker.internet.email();
    session = {
      close: jest.fn(),
      run: jest.fn()
    };
    (driver.session as any).mockReturnValueOnce(session);
    (session.run as any).mockReturnValueOnce({
      records: [
        {
          get: () => ({
            properties: {
              email
            }
          })
        }
      ]
    });
    user = await getUserByEmail(email);
  });

  it("returns the specified user", () => {
    expect(user).toMatchObject({
      email
    });
  });

  it("closes the session", () => {
    expect(session.close).toHaveBeenCalledTimes(1);
  });
});

describe("getUserByID function", () => {
  let id: string;
  let user: User | null;
  let session: any;

  beforeEach(async () => {
    id = faker.random.uuid();
    session = {
      close: jest.fn(),
      run: jest.fn()
    };
    (driver.session as any).mockReturnValueOnce(session);
    (session.run as any).mockReturnValueOnce({
      records: [
        {
          get: () => ({
            properties: {
              id
            }
          })
        }
      ]
    });
    user = await getUserByID(id);
  });

  it("returns the specified user", () => {
    expect(user).toMatchObject({
      id
    });
  });

  it("closes the session", () => {
    expect(session.close).toHaveBeenCalledTimes(1);
  });
});
