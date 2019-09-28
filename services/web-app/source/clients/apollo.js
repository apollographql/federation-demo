import ApolloClient from "apollo-boost";
import { TOKEN_LOCAL_STORAGE_KEY } from "../authProvider";

const client = new ApolloClient({
  request: operation => {
    operation.setContext({
      headers: {
        token: localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY) || null
      }
    });
  },
  uri: "http://localhost:4000"
});

export default client;
