import { ExpressContext } from "apollo-server-express/dist/ApolloServer";

const USER_ID_HEADER = "user-id";

const context = ({ req }: ExpressContext) => ({
  userID: req.headers[USER_ID_HEADER]
});

export default context;
