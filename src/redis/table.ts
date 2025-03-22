import { redis } from "./client";
import { SchemaRegistry } from "./schema";
import { randomUUID } from "crypto";
import { QueryUtils, QueryFilter } from "./query";
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

    await redis.hset(key, validated);
    await redis.sadd(`${tableName}:ids`, id); // Listeleme için
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
      where?: QueryFilter;
      orderBy?: string;
      order?: "asc" | "desc";
      limit?: number;
    }
  ): Promise<Record<string, string>[]> {
    const ids = await redis.smembers(`${tableName}:ids`);
    const records: Record<string, string>[] = [];

    for (const id of ids) {
      const key = `${tableName}:${id}`;
      const data = await redis.hgetall(key);
      if (!data) continue;

      if (options?.where && !QueryUtils.match({ id, ...data }, options.where))
        continue;
      records.push({ id, ...data });
    }

    // Ordering and limit same as before...
  }
}
