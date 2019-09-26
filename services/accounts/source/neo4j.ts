import neo4j from "neo4j-driver";
import uuid from "uuid/v4";
import { User } from "./types";

const url = process.env.NEO4J_HOST || "bolt://accounts-neo4j:7687";
const user = process.env.NEO4J_USER || "neoj4";
const password = process.env.NEO4J_PASSWORD || "accounts";
const driver = neo4j.driver(url, neo4j.auth.basic(user, password));

export async function createUser({ name, username }): Promise<User> {
  const id = uuid();
  const newUser: User = {
    id,
    name,
    username
  };
  const session = driver.session();
  await session.run(
    "CREATE (u:User { id: $id, name: $name, username: $username }) RETURN u AS user",
    newUser
  );
  session.close();
  return newUser;
}

export async function deleteUser(id: string): Promise<void> {
  const session = driver.session();
  await session.run("MATCH (u:User { id: $id }) DELETE u", {
    id
  });
  session.close();
}

export async function getUser(id: string): Promise<User | null> {
  const session = driver.session();
  const result = await session.run(
    "MATCH (u:User { id: $id }) RETURN u AS user LIMIT 1",
    {
      id
    }
  );
  session.close();
  const exists = result.records.length > 0;
  return exists ? result.records[0].get("user").properties : null;
}

export async function getUsers(): Promise<User[]> {
  const session = driver.session();
  const result = await session.run("MATCH (u:User) RETURN u AS users");
  session.close();
  return result.records.map(record => {
    return record.get("users").properties;
  });
}
