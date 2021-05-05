const { buildFederatedSchema } = require("@apollo/federation");
const { ApolloServer, gql } = require("apollo-server");
const { applyMiddleware } = require('graphql-middleware')
const assert = require("assert")

const typeDefs = gql`
  extend type Query {
    me: User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers = {
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

const schema = buildFederatedSchema([{ typeDefs, resolvers }]);

// assertion passes
assert.strictEqual(
  schema.getType("User").resolveReference,
  resolvers.User.__resolveReference
);

const schemaWithMiddleware = applyMiddleware(
  schema,
  (resolve, root, args, context, info) => resolve(root, args, context, info)
);

// assertion fails:
//
// [start-service-accounts] AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
// [start-service-accounts] + actual - expected
// [start-service-accounts]
// [start-service-accounts] + undefined
// [start-service-accounts] - [Function: __resolveReference]
assert.strictEqual(
  schemaWithMiddleware.getType("User").resolveReference,
  resolvers.User.__resolveReference
);

const server = new ApolloServer({ schema: schemaWithMiddleware });

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];
