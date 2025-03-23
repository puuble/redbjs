import { FastifyRequest, FastifyReply } from "fastify";
import { JWT } from "../auth/jwt";

export async function authenticate(req: FastifyRequest, res: FastifyReply) {
  const authHeader = req.headers["authorization"];
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = JWT.verify(token);

  if (!decoded) {
    return res.status(401).send({ error: "Invalid token" });
  }

  // Attach user to request
  (req as any).user = decoded;
}
