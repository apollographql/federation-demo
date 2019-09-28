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

const client = new GraphQLClient(`${GATEWAY_HOST}/graphql`);

const createToken = ({ email, password }) => {
  return client.request(CREATE_TOKEN_MUTATION, {
    email,
    password
  });
};

const createUser = ({ email, name, password }) => {
  return client.request(CREATE_USER_MUTATION, {
    email,
    name,
    password
  });
};

module.exports = {
  createToken,
  createUser
};
