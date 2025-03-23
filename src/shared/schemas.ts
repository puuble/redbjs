import { TableSchema } from "../redis/schema";

export const appSchemas: Record<string, Omit<TableSchema, "name">> = {
  users: {
    primaryKey: "id",
    columns: {
      id: "string",
      email_unique: "string",
      password: "string",
      status: "string",
      createdAt: "date",
    },
  },
  // 🔜 You can define additional tables below
  // products: { primaryKey: 'id', columns: { ... } }
};
