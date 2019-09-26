import { buildFederatedSchema } from "@apollo/federation";
import { ApolloServer, gql } from "apollo-server";
import { createUser, getUser, getUsers } from "./neo4j";

const typeDefs = gql`
  extend type Query {
    me: User
  }

  extend type Mutation {
    createUser(name: String!, username: String!): User!
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers = {
  Mutation: {
    async createUser(_, { name, username }) {
      return createUser({ name, username })
    }
  },
  Query: {
    async me() {
      const users = await getUsers()
      return users[0];
    }
  },
  User: {
    async __resolveReference(object) {
      return getUser(object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      resolvers,
      typeDefs
    }
  ])
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
