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
  directive @tag(name: String!) repeatable on FIELD_DEFINITION | INTERFACE | OBJECT | UNION

  type Review @key(fields: "id") {
    id: ID!
    body: String
    author: User @provides(fields: "username")
    product: Product
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    username: String @external
    reviews: [Review]
  }

  extend type Product @key(fields: "upc") {
    upc: String! @external
    reviews: [Review]
    reviewsForAuthor(authorID: ID!): [Review]
  }
  
  extend type Mutation {
    createReview(upc: ID!, id: ID!, body: String): Review
  }
`;

const resolvers = {
  Review: {
    author(review) {
      return { __typename: "User", id: review.authorID };
    },
  },
  User: {
    reviews(user) {
      return reviews.filter((review) => review.authorID === user.id);
    },
    numberOfReviews(user) {
      return reviews.filter((review) => review.authorID === user.id).length;
    },
    username(user) {
      const found = usernames.find((username) => username.id === user.id);
      return found ? found.username : null;
    },
  },
  Product: {
    reviews(product) {
      return reviews.filter((review) => review.product.upc === product.upc);
    },

    reviewsForAuthor(product, author) {
      return reviews.filter(review => review.product.upc === product.upc && review.authorID === author.authorID);
    }

  },

  Mutation: {
    createReview(p, args) {
      return {
        id: args.id,
        body: args.body,
        product: { upc: args.upc }
      };
    }
  }
};

const usernames = [
  { id: "1", username: "@ada" },
  { id: "2", username: "@complete" },
];
const reviews = [
  {
    id: "1",
    authorID: "1",
    product: { upc: "1" },
    body: "Love it!",
  },
  {
    id: "2",
    authorID: "1",
    product: { upc: "2" },
    body: "Too expensive.",
  },
  {
    id: "3",
    authorID: "2",
    product: { upc: "3" },
    body: "Could be better.",
  },
  {
    id: "4",
    authorID: "2",
    product: { upc: "1" },
    body: "Prefer something else.",
  },
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
  const port = process.env.PORT || 4002;

  await new Promise((resolve) => httpServer.listen({ port }, resolve));
  console.log(
    `🚀 Reviews Server ready at http://localhost:${port}${server.graphqlPath}`
  );
}

startApolloServer(typeDefs, resolvers);
