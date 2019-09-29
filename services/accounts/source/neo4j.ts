import neo4j from "neo4j-driver";
import { Driver } from "neo4j-driver/types/v1";

export const createDriver = (): Driver => {
  const url = process.env.NEO4J_HOST || "bolt://accounts-neo4j:7687";
  const user = process.env.NEO4J_USER || "neoj4";
  const password = process.env.NEO4J_PASSWORD || "accounts";
  return neo4j.driver(url, neo4j.auth.basic(user, password));
};
