# 🔴 RediDB: A Redis-based Tabular Data Engine for TypeScript

RediDB is an experimental TypeScript SDK that lets you use Redis like a **primary database** – with familiar database-like features such as:

- ✅ Table and column definitions
- 📝 Record insertions
- 🔍 Querying with filters and sorting
- ⚡ Super fast, memory-first access
- 🔐 Future: Indexes, unique constraints, transactions

## Why RediDB?

Redis is often seen as "just a cache" – but it’s way more powerful.

This project aims to **bridge the gap** between classic relational database logic and Redis primitives. Think of it as a minimal Firestore or Supabase built on top of Redis, optimized for speed and scalability.

## 📁 Project Structure

/src redis/ client.ts // Redis client setup (ioredis) schema.ts // Table definitions & schema registry table.ts // Insert, find, and core operations query.ts // Advanced filtering, ordering (WIP) transaction.ts // Redis transaction helpers (WIP) server/ api.ts // Optional: REST API layer router.ts // Route registration index.ts // Entry point

/tests redis.spec.ts // Unit & integration tests

/examples create-user.ts // Sample usage for inserting user

## Quick Start

```ts
import { SchemaRegistry, RedisTable } from 'redidb';

SchemaRegistry.defineTable({
  name: 'users',
  primaryKey: 'id',
  columns: {
    id: 'string',
    email: 'string',
    password: 'string',
    createdAt: 'date',
  },
});

await RedisTable.insert('users', {
  email: 'test@example.com',
  password: 'hashed-password',
  createdAt: new Date().toISOString(),
});

const result = await RedisTable.find('users', {
  where: { email: 'test@example.com' },
  orderBy: 'createdAt',
  order: 'desc',
  limit: 1,
});

console.log(result);

🗺 Roadmap
🔎 Advanced Filtering

📊 SortedSet Indexing

🧱 Unique Constraints

💥 Transaction Support

🌐 API Service Layer

💡 Upstash Integration

💼 SaaS Dashboard
```

Vision
The goal is to build a lightweight, scalable, and developer-friendly Redis-powered database system with real use cases in high-traffic environments. In the future, this will also be available as a hosted low-code data engine on platforms like Upstash.
