require("./open-telemetry.js");
const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  // This entire `serviceList` is optional when running in managed federation
  // mode, using Apollo Graph Manager as the source of truth.  In production,
  // using a single source of truth to compose a schema is recommended and
  // prevents composition failures at runtime using schema validation using
  // real usage-based metrics.
  serviceList: [
    { name: "accounts", url: "https://accounts.demo.starstuff.dev" },
    { name: "reviews", url: "https://reviews.demo.starstuff.dev" },
    { name: "products", url: "https://products.demo.starstuff.dev" },
    { name: "inventory", url: "https://inventory.demo.starstuff.dev" }
  ],

  // Experimental: Enabling this enables the query plan view in Playground.
  __exposeQueryPlanExperimental: false,
});

setTimeout(() => {
  (async () => {
    const server = new ApolloServer({
      gateway,
  
      // Apollo Graph Manager (previously known as Apollo Engine)
      // When enabled and an `ENGINE_API_KEY` is set in the environment,
      // provides metrics, schema management and trace reporting.
      engine: false,
  
      // Subscriptions are unsupported but planned for a future Gateway version.
      subscriptions: false,
    });
  
    server.listen({ port: 4100 }).then(({ url }) => {
      console.log(`🚀 Server ready at ${url}`);
    });
  })();
}, 2000);
