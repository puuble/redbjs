import { SchemaRegistry } from "../redis/schema";
import { RedisTable } from "../redis/table";

async function main() {
  SchemaRegistry.defineTable({
    name: "users",
    primaryKey: "id",
    columns: {
      id: "string",
      email: "string",
      password: "string",
      createdAt: "date",
    },
  });

  await RedisTable.insert("users", {
    email: "jane@example.com",
    password: "123456",
    createdAt: new Date().toISOString(),
  });

  const users = await RedisTable.findAll("users");
  console.log(users);
}

main();
