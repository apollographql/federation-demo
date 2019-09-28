const faker = require("faker");
const { GraphQLClient } = require("graphql-request");

const CREATE_TOKEN_MUTATION = `
  mutation($email: String!, $password: String!) {
    createToken(email: $email, password: $password)
  }
`;
const CREATE_USER_MUTATION = `
  mutation($email: String!, $name: String!, $password: String!) {
    createUser(email: $email, name: $name, password: $password) {
      email
      id
      name
    }
  }
`;
const GATEWAY_HOST = process.env.GATEWAY_HOST || "http://localhost:4000";
const JWT_REGEX = "^[A-Za-z0-9-_=]+.[A-Za-z0-9-_=]+.?[A-Za-z0-9-_.+/=]*$";
const UUID_REGEX =
  "([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}){1}";

const client = new GraphQLClient(`${GATEWAY_HOST}/graphql`);

describe("creating a new user", () => {
  let name;
  let email;
  let password;
  let response;

  beforeEach(async () => {
    name = faker.name.findName();
    email = faker.internet.email();
    password = faker.internet.password();
    response = await client.request(CREATE_USER_MUTATION, {
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
      response = await client.request(CREATE_TOKEN_MUTATION, {
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
        response = await client.request(CREATE_TOKEN_MUTATION, {
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
