// src/middleware/authorizeRole.ts
import { FastifyRequest, FastifyReply } from "fastify";

export function authorizeRole(...allowedRoles: string[]) {
  return async (req: FastifyRequest, res: FastifyReply) => {
    const role = (req as any).user?.role;

    if (!role || !allowedRoles.includes(role)) {
      return res
        .status(403)
        .send({ error: "Forbidden: insufficient permissions" });
    }
  };
}
