import { redis } from "./client";
import { SchemaRegistry } from "./schema";
import { randomUUID } from "crypto";
import { QueryUtils, QueryFilter } from "./query";
import { RedisIndex } from "./indexes";

export class RedisTable {
  static async insert(tableName: string, data: Record<string, any>) {
    const schema = SchemaRegistry.getTable(tableName);
    const id = schema.primaryKey
      ? data[schema.primaryKey] || randomUUID()
      : randomUUID();
    const key = `${tableName}:${id}`;

    const validated: Record<string, string> = {};
    for (const col in schema.columns) {
      if (data[col] === undefined) continue;
      validated[col] = String(data[col]);
    }

    // 👉 Unique fields kontrolü
    for (const [col, type] of Object.entries(schema.columns)) {
      if (col.endsWith("_unique") && validated[col]) {
        const field = col.replace("_unique", "");
        const value = validated[col];
        const isOk = await RedisIndex.isUnique(tableName, field, value);
        if (!isOk)
          throw new Error(`Unique constraint failed: ${field} = "${value}"`);
        await RedisIndex.addUnique(tableName, field, value);
      }
    }

    await redis.hset(key, validated);
    await redis.sadd(`${tableName}:ids`, id);
    return { id, ...validated };
  }

  static async findAll(tableName: string): Promise<Record<string, string>[]> {
    const ids = await redis.smembers(`${tableName}:ids`);
    const results = await Promise.all(
      ids.map(async (id) => {
        const key = `${tableName}:${id}`;
        const data = await redis.hgetall(key);
        return { id, ...data };
      })
    );
    return results;
  }

  static async find(
    tableName: string,
    options?: {
      where?: QueryFilter | QueryFilter[];
      orderBy?: string;
      order?: "asc" | "desc";
      limit?: number;
    }
  ): Promise<Record<string, string>[]> {
    const ids = await redis.smembers(`${tableName}:ids`);
    let records: Record<string, string>[] = [];

    for (const id of ids) {
      const key = `${tableName}:${id}`;
      const data = await redis.hgetall(key);
      if (!data) continue;

      const fullData = { id, ...data };

      const match = (() => {
        if (!options?.where) return true;
        if (Array.isArray(options.where)) {
          return options.where.every((f) => QueryUtils.match(fullData, f));
        } else {
          return QueryUtils.match(fullData, options.where);
        }
      })();

      if (match) records.push(fullData);
    }

    return records;
  }

  static async update(
    tableName: string,
    id: string,
    updates: Record<string, any>
  ): Promise<Record<string, string>> {
    const schema = SchemaRegistry.getTable(tableName);
    const key = `${tableName}:${id}`;

    const existing = await redis.hgetall(key);
    if (!existing || Object.keys(existing).length === 0) {
      throw new Error(`Record "${id}" not found`);
    }

    const updated: Record<string, string> = {};

    for (const col in updates) {
      if (!schema.columns[col]) continue; // kolon yoksa atla
      updated[col] = String(updates[col]);

      // Eğer unique index varsa: eski değeri kaldır, yeniyi ekle
      if (col.endsWith("_unique")) {
        const field = col.replace("_unique", "");
        const oldVal = existing[col];
        const newVal = updated[col];

        if (oldVal && oldVal !== newVal) {
          await RedisIndex.removeUnique(tableName, field, oldVal);
        }

        const isUnique = await RedisIndex.isUnique(tableName, field, newVal);
        if (!isUnique)
          throw new Error(`Unique constraint failed on ${field}="${newVal}"`);

        await RedisIndex.addUnique(tableName, field, newVal);
      }
    }

    await redis.hset(key, updated);
    return { id, ...existing, ...updated };
  }

  static async delete(tableName: string, id: string): Promise<boolean> {
    const schema = SchemaRegistry.getTable(tableName);
    const key = `${tableName}:${id}`;
    const data = await redis.hgetall(key);

    if (!data || Object.keys(data).length === 0) return false;

    // Unique index'leri temizle
    for (const col of Object.keys(schema.columns)) {
      if (col.endsWith("_unique") && data[col]) {
        const field = col.replace("_unique", "");
        await RedisIndex.removeUnique(tableName, field, data[col]);
      }
    }

    await redis.del(key);
    await redis.srem(`${tableName}:ids`, id);
    return true;
  }
}
