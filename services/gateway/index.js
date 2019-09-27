const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const { ApolloServer } = require("apollo-server");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const gateway = new ApolloGateway({
  buildService({ url }) {
    return new RemoteGraphQLDataSource({
      url,
      willSendRequest({ request, context }) {
        request.http.headers.set("user-id", context.userID);
      }
    });
  },
  serviceList: [
    { name: "accounts", url: "http://accounts:4000/graphql" },
    { name: "reviews", url: "http://reviews:4000/graphql" },
    { name: "products", url: "http://products:4000/graphql" },
    { name: "inventory", url: "http://inventory:4000/graphql" }
  ]
});

const getUserID = request => {
  const { token } = request.headers;
  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const { id } = decoded;
      return id;
    } catch (error) {}
  }
  return null;
};

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({
    context: ({ req }) => ({
      userID: getUserID(req)
    }),
    executor,
    schema
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
