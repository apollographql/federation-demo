import { buildFederatedSchema } from "@apollo/federation";
import { ApolloServer, gql } from "apollo-server";
import uuid from "uuid/v4";

const typeDefs = gql`
  extend type Query {
    me: User
  }

  extend type Mutation {
    createUser(name: String!, username: String!): User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers = {
  Mutation: {
    createUser(_, { name, username }) {
      const newUser = {
        id: uuid(),
        name,
        username
      }
      users.push(newUser)
      return newUser
    }
  },
  Query: {
    me() {
      return users[0];
    }
  },
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ])
});

server.listen({ port: process.env.PORT }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    username: "@complete"
  }
];
