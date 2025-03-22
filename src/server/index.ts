import app from "./api";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import userRoutes from "./routes";
async function start() {
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "RedbJS API",
        version: "0.1.0",
      },
    },
  });

  await app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
  });
  await app.register(userRoutes); // 👈 Register all user-related routes
  await app.listen({ port: 3131 });
  console.log("🚀 Server ready at http://localhost:3131");
  console.log("📚 Swagger UI at http://localhost:3131/docs");
}

start();
