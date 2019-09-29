import uuid from "uuid/v4";
import { createDriver } from "../neo4j";
import { hashPassword } from "../passwords";
import { User } from "../types";

const driver = createDriver();

export async function createUser({ email, name, password }): Promise<User> {
  const id = uuid();
  const newUser: User = {
    email,
    id,
    name,
    password: await hashPassword(password)
  };
  const session = driver.session();
  await session.run(
    "CREATE (u:User { email: $email, id: $id, name: $name, password: $password }) RETURN u AS user",
    newUser
  );
  session.close();
  return newUser;
}

export async function deleteUser({ id }): Promise<void> {
  const session = driver.session();
  await session.run("MATCH (u:User { id: $id }) DELETE u", {
    id
  });
  session.close();
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const session = driver.session();
  const result = await session.run(
    "MATCH (u:User { email: $email }) RETURN u AS user LIMIT 1",
    {
      email
    }
  );
  session.close();
  const exists = result.records.length > 0;
  return exists ? result.records[0].get("user").properties : null;
}

export async function getUserByID(id: string): Promise<User | null> {
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
