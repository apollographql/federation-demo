const faker = require("faker");
const { createToken, createUser } = require("./gateway");

const JWT_REGEX = "^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$";
const UUID_REGEX =
  "([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}){1}";

describe("creating a new user", () => {
  let name;
  let email;
  let password;
  let response;

  beforeEach(async () => {
    name = faker.name.findName();
    email = faker.internet.email();
    password = faker.internet.password();
    response = await createUser({
      email,
      name,
      password
    });
  });

  it("returns the new user", () => {
    expect(response).toEqual({
      createUser: {
        email,
        id: expect.stringMatching(UUID_REGEX),
        name
      }
    });
  });

  describe("creating a token with valid credentials", () => {
    let response;

    beforeEach(async () => {
      response = await createToken({
        email,
        password
      });
    });

    it("returns a JWT token", () => {
      expect(response).toEqual({
        createToken: expect.stringMatching(JWT_REGEX)
      });
    });
  });

  describe("creating a token with incorrect password", () => {
    let errorResponse;

    beforeEach(async () => {
      try {
        response = await createToken({
          email,
          password: "wrong password"
        });
      } catch (error) {
        errorResponse = error;
      }
    });

    it("returns an error", () => {
      expect(errorResponse).toBeInstanceOf(Error);
      expect(errorResponse.message).toEqual(
        expect.stringContaining("Invalid email or password.")
      );
    });
  });
});
