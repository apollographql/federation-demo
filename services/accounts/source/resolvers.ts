import { createUser, getUserByID } from "./repositories/users";
import { createToken } from "./tokens";

const resolvers = {
  Mutation: {
    async createToken(_, { email, password }) {
      return createToken({ email, password });
    },
    async createUser(_, { email, name, password }) {
      return createUser({ email, name, password });
    }
  },
  Query: {
    async me(_, {}, context) {
      return getUserByID(context.userID);
    }
  },
  User: {
    async __resolveReference(object) {
      return getUserByID(object.id);
    }
  }
};

export default resolvers;
