const { ApolloServer, gql } = require("apollo-server");
const { buildFederatedSchema } = require("@apollo/federation");

var counter = 0;

const typeDefs = gql`
  extend type Product @key(fields: "upc") {
    upc: String! @external
    inStock: Boolean
  }
`;

const resolvers = {
  Product: {
    __resolverReference(object) {
      return {
        ...object,
        ...inventory.find(product => product.upc === object.upc)
      }
    },
    inStock(object) {
      const found = inventory.find(product => product.upc === object.upc)
      return found? found.inStock : null;
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
    console.log(`Reviews:Sending response - ${++counter}`);
    // console.log(requestContext);
  }
});

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

const inventory = [
  { upc: "1", inStock: true },
  { upc: "2", inStock: false },
  { upc: "3", inStock: true }
];
