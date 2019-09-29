import { createDriver } from "./neo4j";

describe("createDriver function", () => {
  it("returns a Neo4j driver", () => {
    expect(createDriver()).toBeDefined();
  });
});
