import { FastifyInstance } from "fastify";
import { RedisTable } from "../redis/table";
import { QueryFilter } from "../redis/query";

export default async function userRoutes(app: FastifyInstance) {
  // 📤 Read all
  app.get(
    "/users",
    {
      schema: {
        description: "Get all users with optional filters",
        tags: ["Users"],
        querystring: {
          type: "object",
          properties: {
            email: { type: "string" },
            status: { type: "string" },
          },
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                email: { type: "string" },
                status: { type: "string" },
                createdAt: { type: "string" },
              },
            },
          },
        },
      },
    },
    async (req, res) => {
      const query = req.query as Record<string, string>;

      const filters = Object.entries(query).map(([field, value]) => ({
        field,
        op: "eq",
        value,
      }));

      const users = await RedisTable.find("users", {
        where: filters.length > 0 ? filters : undefined,
      });

      return users;
    }
  );
  app.post(
    "/users",
    {
      schema: {
        description: "Create a new user",
        tags: ["Users"],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
            status: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              id: { type: "string" },
              email: { type: "string" },
            },
          },
        },
      },
    },
    async (req, res) => {
      try {
        const user = await RedisTable.insert("users", req.body as any);
        return user;
      } catch (err: any) {
        return res.status(400).send({ error: err.message });
      }
    }
  );

  // ✏️ Update User
  app.put(
    "/users/:id",
    {
      schema: {
        description: "Update user by ID",
        tags: ["Users"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        body: {
          type: "object",
          properties: {
            email: { type: "string" },
            password: { type: "string" },
            status: { type: "string" },
          },
        },
      },
    },
    async (req, res) => {
      const { id } = req.params as any;
      const updated = await RedisTable.update("users", id, req.body as any);
      return updated;
    }
  );

  // ❌ Delete User
  app.delete(
    "/users/:id",
    {
      schema: {
        description: "Delete user by ID",
        tags: ["Users"],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
            },
          },
        },
      },
    },
    async (req, res) => {
      const { id } = req.params as any;
      const ok = await RedisTable.delete("users", id);
      return { success: ok };
    }
  );
}
