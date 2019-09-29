import faker from "faker";
import context from "./context";
import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

describe("context function", () => {
  it("extracts the user ID from the request", () => {
    const userID = faker.random.uuid();
    expect(
      context({
        req: {
          headers: {
            "user-id": userID
          }
        }
      } as any)
    ).toEqual({
      userID
    });
  });
});
