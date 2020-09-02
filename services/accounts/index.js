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
  }

  type Product @key(fields: "upc") {
    upc: String!
    name: String
    price: Int
    weight: Int
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
    }
  },
  Product: {
    __resolveReference(object) {
      return products.find(product => product.upc === object.upc);
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
    console.log(`Accounts:Sending response - ${counter++}`);
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
