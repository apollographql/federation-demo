import faker from "faker";
import { Driver } from "neo4j-driver/types/v1";
import { User } from "../types";
import {
  createUser,
  deleteUser,
  getUserByEmail,
  getUserByID,
  getUsers
} from "./users";

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
  describe("when user exists", () => {
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

  describe("when user does not exist", () => {
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
        records: []
      });
      user = await getUserByEmail(email);
    });

    it("returns the specified user", () => {
      expect(user).toBeNull();
    });

    it("closes the session", () => {
      expect(session.close).toHaveBeenCalledTimes(1);
    });
  });
});

describe("getUserByID function", () => {
  describe("when user exists", () => {
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

  describe("when user does not exist", () => {
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
        records: []
      });
      user = await getUserByID(id);
    });

    it("returns null", () => {
      expect(user).toBeNull();
    });

    it("closes the session", () => {
      expect(session.close).toHaveBeenCalledTimes(1);
    });
  });
});

describe("getUsers function", () => {
  let users: User[];
  let session: any;

  beforeEach(async () => {
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
              id: faker.random.uuid()
            }
          })
        },
        {
          get: () => ({
            properties: {
              id: faker.random.uuid()
            }
          })
        },
        {
          get: () => ({
            properties: {
              id: faker.random.uuid()
            }
          })
        }
      ]
    });
    users = await getUsers();
  });

  it("returns a list of users", () => {
    expect(users).toEqual([
      {
        id: expect.any(String)
      },
      {
        id: expect.any(String)
      },
      {
        id: expect.any(String)
      }
    ]);
  });

  it("closes the session", () => {
    expect(session.close).toHaveBeenCalledTimes(1);
  });
});
