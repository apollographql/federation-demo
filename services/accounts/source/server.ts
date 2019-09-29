import { buildFederatedSchema } from "@apollo/federation";
import { ApolloServer, gql } from "apollo-server";
import { createUser, getUserByID } from "./repositories/users";
import { createToken } from "./tokens";

const NODE_ENV = process.env.NODE_ENV || "development";
const USER_ID_HEADER = "user-id";

const typeDefs = gql`
  extend type Query {
    me: User
  }

  extend type Mutation {
    createToken(email: String!, password: String!): String!
    createUser(name: String!, email: String!, password: String!): User!
  }

  type User @key(fields: "id") {
    email: String!
    id: ID!
    name: String!
  }
`;

const resolvers = {
  Mutation: {
    async createToken(_, { email, password }) {
      return createToken({ email, password });
    },
    async createUser(_, { email, name, password }) {
      return createUser({ email, name, password });
    }
  },
  Query: {
    async me(_, {}, context) {
      return getUserByID(context.userID);
    }
  },
  User: {
    async __resolveReference(object) {
      return getUserByID(object.id);
    }
  }
};

const server = new ApolloServer({
  context: request => ({
    userID: request.req.headers[USER_ID_HEADER]
  }),
  debug: NODE_ENV !== "production",
  schema: buildFederatedSchema([
    {
      resolvers,
      typeDefs
    }
  ])
});

export default server;
