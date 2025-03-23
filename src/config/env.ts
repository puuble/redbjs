import dotenv from "dotenv";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development",
});

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 3131,
  JWT_SECRET: process.env.JWT_SECRET || "dev-secret",
  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",
};
