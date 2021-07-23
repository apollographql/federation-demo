const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

var counter = 0;

const typeDefs = gql`
  extend type Query {
    me: User
    topProducts(first: Int = 5): [Product]
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
    reviews: [Review]
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
    reviews: [Review]
    shippingEstimate: Int
  }

  type Review @key(fields: "id") {
    id: ID!
    body: String
    author: User
    product: Product
  }
`;

const resolvers = {
  Query: {
    me() {
      return users[0];
    },
    topProducts(_, args) {
      return products.slice(0, args.first);
    }
  },
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    },
    reviews(user) {
      return reviews.filter(review => review.authorID === user.id);
    },
    numberOfReviews(user) {
      return reviews.filter(review => review.authorID === user.id).length;
    },
    username(object) {
      const found = users.find(user => user.id === object.id);
      return found? found.username : null;
    },
    name(object) {
      const found = users.find(user => user.id === object.id);
      return found? found.name : null;
    }
  },
  Product: {
    __resolveReference(object) {
      return products.find(product => product.upc === object.upc);
    },
    reviews(product) {
      return reviews.filter(review => review.product.upc === product.upc);
    },
    shippingEstimate(object) {
      const found = products.find(product => product.upc === object.upc)
      // free for expense items
      if (!found || found.price > 1000) return 0;
      // estimate is based on weight
      return found.weight * 0.5;
    },
    name(object) {
      const found = products.find(product => product.upc == object.upc)
      return found? found.name : null;
    },
    price(object) {
      const found = products.find(product => product.upc == object.upc)
      return found? found.price : null;
    },
    weight(object) {
      const found = products.find(product => product.upc == object.upc)
      return found? found.weight : null;
    }
  },
  Review: {
    __resolveReference(object) {
      return reviews.find(review => review.id === object.id);
    },
    author(review) {
      return { __typename: "User", id: review.authorID };
    },
    product(object) {
      const found = reviews.find(review => review.id === object.id);
      const result = found
        ? { __typename: "Product", upc: found.product.upc } 
        : null;
      return result;
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  formatResponse: (response, requestContext) => {
    console.log(`Accounts:Sending response - ${++counter}`);
    // console.log(requestContext);
  }
});

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

const products = [
  {
    upc: "1",
    name: "Table",
    price: 899,
    weight: 100
  },
  {
    upc: "2",
    name: "Couch",
    price: 1299,
    weight: 1000
  },
  {
    upc: "3",
    name: "Chair",
    price: 54,
    weight: 50
  }
];

const reviews = [
  {
    id: "1",
    authorID: "1",
    product: { upc: "1" },
    body: "Love it!"
  },
  {
    id: "2",
    authorID: "1",
    product: { upc: "2" },
    body: "Too expensive."
  },
  {
    id: "3",
    authorID: "2",
    product: { upc: "3" },
    body: "Could be better."
  },
  {
    id: "4",
    authorID: "2",
    product: { upc: "1" },
    body: "Prefer something else."
  }
];
