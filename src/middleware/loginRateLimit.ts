// src/middleware/loginRateLimit.ts
import { FastifyRequest, FastifyReply } from "fastify";
import { redis } from "../redis/client";

export async function loginRateLimit(req: FastifyRequest, res: FastifyReply) {
  const email = (req.body as any)?.email;
  if (!email) return; // No email, skip limiting

  const ex = parseInt((req.query as any).ex || "60");
  const key = `ratelimit:login:${email}`;

  const count = await redis.incr(key);
  if (count === 1) {
    await redis.expire(key, ex);
  }

  if (count > 5) {
    return res
      .status(429)
      .send({ error: "Too many login attempts. Please wait." });
  }
}
