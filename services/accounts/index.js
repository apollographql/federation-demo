require("./open-telemetry.js");
const { ApolloServer, gql } = require("apollo-server-express");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const rateLimit = require("express-rate-limit");
const express = require("express");
const http = require("http");
const { ApolloServerPluginInlineTraceDisabled } = require("apollo-server-core");
const cors = require("cors");

const rateLimitTreshold = process.env.LIMIT || 5000;

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

const users = [
  {
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada",
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete",
  },
];

const resolvers = {
  Query: {
    me() {
      return users[0];
    },
  },
  User: {
    __resolveReference(object) {
      return users.find((user) => user.id === object.id);
    },
  },
};

async function startApolloServer(typeDefs, resolvers) {
  // Required logic for integrating with Express
  const app = express();

  const limiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: rateLimitTreshold,
  });

  app.use(cors());
  app.use(limiter);

  const httpServer = http.createServer(app);

  const server = new ApolloServer({
    schema: buildSubgraphSchema([
      {
        typeDefs,
        resolvers,
      },
    ]),
    plugins: [
      ApolloServerPluginInlineTraceDisabled(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: "/",
  });

  // Modified server startup
  const port = process.env.PORT || 4001;

  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `🚀 Accounts Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);
