import gql from "graphql-tag";
import {
  AUTH_CHECK,
  AUTH_ERROR,
  AUTH_GET_PERMISSIONS,
  AUTH_LOGIN,
  AUTH_LOGOUT
} from "react-admin";
import client from "./clients/apollo";

const CREATE_TOKEN_MUTATION = gql`
  mutation CreateToken($email: String!, $password: String!) {
    createToken(email: $email, password: $password)
  }
`;
const ME_QUERY = gql`
  query {
    me {
      id
    }
  }
`;

export const TOKEN_LOCAL_STORAGE_KEY = "token";

export default async (type, params) => {
  console.log(type, params);
  if (type === AUTH_LOGIN) {
    const { username, password } = params;
    try {
      const { data } = await client.mutate({
        mutation: CREATE_TOKEN_MUTATION,
        variables: {
          email: username,
          password
        }
      });
      if (data && data.createToken) {
        localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY, data.createToken);
        return Promise.resolve();
      }
    } catch (error) {
      console.error(error);
    }
    return Promise.reject();
  }
  if (type === AUTH_LOGOUT) {
    localStorage.removeItem(TOKEN_LOCAL_STORAGE_KEY);
    return Promise.resolve();
  }
  if (type === AUTH_ERROR) {
    const { status } = params;
    return status === 401 || status === 403
      ? Promise.reject()
      : Promise.resolve();
  }
  if (type === AUTH_CHECK) {
    const { data } = await client.query({
      query: ME_QUERY
    });
    if (data && data.me) {
      return Promise.resolve();
    }
    return Promise.reject();
  }
  if (type === AUTH_GET_PERMISSIONS) {
    const role = localStorage.getItem("role");
    return Promise.resolve(role);
  }
  return Promise.reject("Unknown method");
};
