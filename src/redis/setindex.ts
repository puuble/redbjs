import { redis } from "./client";

export class RedisSetIndex {
  static key(table: string, field: string, value: string) {
    return `${table}:index:${field}:${value}`;
  }

  static async add(table: string, field: string, value: string, id: string) {
    const key = this.key(table, field, value);
    await redis.sadd(key, id);
  }

  static async remove(table: string, field: string, value: string, id: string) {
    const key = this.key(table, field, value);
    await redis.srem(key, id);
  }

  static async scan(
    table: string,
    field: string,
    value: string
  ): Promise<string[]> {
    const key = this.key(table, field, value);
    return await redis.smembers(key);
  }
}
