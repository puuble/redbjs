import { FastifyInstance } from "fastify";
import { RedisTable } from "../redis/table";
import { JWT } from "../auth/jwt";
import { User } from "../shared/types";
import { hashPassword, comparePassword } from "../auth/password";
import { authenticate } from "../middleware/authMiddleware";
import { rateLimit } from "../middleware/rateLimit";

export default async function userRoutes(app: FastifyInstance) {
  app.get("/protected-endpoint", {
    preHandler: [authenticate, rateLimit],
    handler: async (req, res) => {
      // safe access: (req as any).user
      return { message: "Authorized and within rate limit" };
    },
  });
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

  app.post(
    "/auth/login",
    {
      schema: {
        description: "Login and receive a JWT token",
        tags: ["Auth"],
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              token: { type: "string" },
            },
          },
          401: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (req, res) => {
      const { email, password } = req.body as any;

      const users = await RedisTable.find("users", {
        where: [
          { field: "email", op: "eq", value: email },
          { field: "password", op: "eq", value: password },
        ],
        limit: 1,
      });

      const user = users[0];

      if (!user) {
        return res.status(401).send({ error: "Invalid email or password" });
      }

      const valid = await comparePassword(password, user.password);
      if (!valid)
        return res.status(401).send({ error: "Invalid email or password" });

      const token = JWT.sign({ userId: user.id, email: user.email });
      return { token };
    }
  );

  app.post(
    "/auth/register",
    {
      schema: {
        description: "Register a new user",
        tags: ["Auth"],
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
              createdAt: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (req, res) => {
      const { email, password, status } = req.body as any;

      try {
        const hashed = await hashPassword(password);
        const user = (await RedisTable.insert("users", {
          email,
          password: hashed,
          status: status || "active",
          createdAt: new Date().toISOString(),
        })) as User;

        return {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt,
        };
      } catch (err: any) {
        return res.status(400).send({ error: err.message });
      }
    }
  );
}
