import { RedisTable } from "../redis/table";

await RedisTable.find("users", {
  where: { field: "email", op: "contains", value: "@gmail.com" },
  orderBy: "createdAt",
  order: "desc",
  limit: 5,
});
await RedisTable.find("users", {
  where: { field: "loginCount", op: "gt", value: 10 },
});
