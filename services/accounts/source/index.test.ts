import server from "./server";

jest.mock("./server", () => ({
  listen: jest.fn(() => Promise.resolve({ url: "http://localhost:4000" }))
}));

it("starts the server", () => {
  require(".");
  expect(server.listen).toBeCalledTimes(1);
});
