import { ApolloServer } from "apollo-server-express";
import server from "./server";

it("exports a ApolloServer instance", () => {
  expect(server).toBeInstanceOf(ApolloServer);
});
