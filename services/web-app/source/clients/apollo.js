import ApolloClient from "apollo-boost";
import { TOKEN_LOCAL_STORAGE_KEY } from "../authProvider";

const GATEWAY_HOST = process.env.GATEWAY_HOST || "http://localhost:4000";

const client = new ApolloClient({
  request: operation => {
    operation.setContext({
      headers: {
        token: localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY) || null
      }
    });
  },
  uri: `${GATEWAY_HOST}/graphql`
});

export default client;
