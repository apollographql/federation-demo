require("./open-telemetry.js");
const { ApolloServer, gql } = require("apollo-server-express");
const { buildSubgraphSchema } = require("@apollo/subgraph");
const { ApolloServerPluginDrainHttpServer } = require("apollo-server-core");
const rateLimit = require("express-rate-limit");
const express = require("express");
const http = require("http");
const cors = require("cors");

const rateLimitTreshold = process.env.LIMIT || 5000;

const typeDefs = gql`
  directive @tag(name: String!) repeatable on FIELD_DEFINITION | INTERFACE | OBJECT | UNION

  extend type Product @key(fields: "upc") {
    upc: String! @external
    weight: Int @external
    price: Int @external
    inStock: Boolean
    shippingEstimate: Int @requires(fields: "price weight")
  }
`;

const resolvers = {
  Product: {
    __resolveReference(object) {
      return {
        ...object,
        ...inventory.find((product) => product.upc === object.upc),
      };
    },
    shippingEstimate(object) {
      // free for expensive items
      if (object.price > 1000) return 0;
      // estimate is based on weight
      return object.weight * 0.5;
    },
  },
};

const inventory = [
  { upc: "1", inStock: true },
  { upc: "2", inStock: false },
  { upc: "3", inStock: true },
];

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
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
  });

  await server.start();
  server.applyMiddleware({
    app,
    path: "/",
  });

  // Modified server startup
  const port = process.env.PORT || 4004;

  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `🚀 Inventory Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);
