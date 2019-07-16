const { ApolloServer } = require('apollo-server');
const { ApolloGateway } = require('@apollo/gateway');

// Managed configuration will be picked up using the API key
const gateway = new ApolloGateway({debug: true});

// Pass the gateway to Apollo Server
const server = new ApolloServer({ gateway, subscriptions: false });

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
