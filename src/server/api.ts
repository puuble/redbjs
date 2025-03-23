import Fastify from "fastify";

const app = Fastify({
  logger: true,
});
import { SchemaRegistry } from "../redis/schema";
import { appSchemas } from "../shared/schemas";

// ✅ Register all tables with one line
SchemaRegistry.defineMultiple(appSchemas);
export default app;
