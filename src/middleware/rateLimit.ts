import { FastifyRequest, FastifyReply } from "fastify";
import { redis } from "../redis/client";

export async function rateLimit(req: FastifyRequest, res: FastifyReply) {
  const userId = ((req as any).user?.userId || "anonymous") as string;
  const route = req.routeOptions?.url || req.url;
  const ex = parseInt((req.query as any).ex || "60");
  const key = `ratelimit:${userId}:${route}`;

  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, ex);

  if (count > 10) {
    return res.status(429).send({ error: "Rate limit exceeded" });
  }
}
