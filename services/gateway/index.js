const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "accounts", url: "http://accounts:4000/graphql" },
    { name: "reviews", url: "http://reviews:4000/graphql" },
    { name: "products", url: "http://products:4000/graphql" },
    { name: "inventory", url: "http://inventory:4000/graphql" }
  ]
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({ schema, executor });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
