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
    topProducts(first: Int = 5): [Product]
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
  }

  extend type Mutation {
    createProduct(upc: ID!, name: String): Product
  }
`;

const products = [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100,
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000,
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50,
  },
];

const resolvers = {
  Product: {
    __resolveReference(object) {
      return products.find((product) => product.upc === object.upc);
    },
  },
  Query: {
    topProducts(_, args) {
      return products.slice(0, args.first);
    },
  },

  Mutation: {
    createProduct(_, args) {
      return {
        upc: args.upc,
        name: args.name,
      };
    },
  }
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
  const port = process.env.PORT || 4003;

  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `🚀 Products Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);
