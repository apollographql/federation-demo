import { buildFederatedSchema } from "@apollo/federation";
import { ApolloServer, gql } from "apollo-server";
import context from "./context";
import resolvers from "./resolvers";

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

const server = new ApolloServer({
  context,
  debug: process.env.NODE_ENV !== "production",
  schema: buildFederatedSchema([
    {
      resolvers,
      typeDefs
    }
  ])
});

export default server;
