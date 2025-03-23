# RedbJS

🚀 **RedbJS** is a Redis-powered database engine and TypeScript library that allows you to define schemas, insert and query data, apply filters, transactions, JWT authentication, and rate limiting — all inside Redis.

> Use Redis like a real database. Simple, fast, open.

---

## 🧠 Why RedbJS?

Most people only use Redis as a cache. This project proves you can treat Redis like a primary database using data modeling, indexing, filtering, and transactional workflows — without losing the blazing-fast performance Redis is known for.

---

## ✨ Features

- 🗂 Define tables & schemas (like SQL)
- 🔐 JWT authentication support
- ⚡ Redis-powered rate limiting
- 🔍 Query with filters, sorting, and unique constraints
- 💾 Persistence via Redis snapshots (RDB or AOF)
- 🧪 Full Swagger API documentation
- 🚀 Fastify-based backend

---

## 📁 Project Structure

```
/src
  redis/
    client.ts           # Redis connection instance
    schema.ts           # Table & column schema system
    table.ts            # Table operations: insert, update, delete, find
    query.ts            # Filter logic and query matching
    transaction.ts      # Redis transactions
  server/
    api.ts              # Fastify app definition
    router.ts           # Route registration
  auth/
    jwt.ts              # JWT helper
    password.ts         # bcrypt helper
  middleware/
    auth.ts             # JWT authentication middleware
    rateLimit.ts        # Redis rate limiter
  config/
    env.ts              # .env loader and environment variables
  index.ts              # App bootstrap
/tests
  redis.spec.ts         # Unit tests for Redis operations
/examples
  create-user.ts        # Example usage script
```

---

## 🛠 Environment Setup

### Development

Create a `.env.development` file:

```env
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret
REDIS_URL=redis://localhost:6379
```

Then run:

```bash
npm install
npm run dev
```

---

## 📖 API Documentation

Swagger UI is available at:

```
http://localhost:3000/docs
```

You can test:

- Register: `POST /auth/register`
- Login: `POST /auth/login`
- Authenticated user: `GET /auth/me`
- Protected routes with `Authorize` button (JWT required)

---

## 📦 What's Next?

This is the open source version of RedbJS. In the future, we plan to offer:

- A full visual admin panel (RedisMyAdmin)
- Low-code workflow builder (flows → jobs → events)
- Multi-tenant auth, roles, and job queues
- RedbJS Cloud with SLA-backed Redis infrastructure

---

## ❤️ Credits

Inspired by the Redis philosophy: _simple primitives, powerful possibilities._

MIT Licensed · Built with TypeScript
