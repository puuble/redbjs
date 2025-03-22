import { redis } from "./client";

export class RedisIndex {
  static getUniqueKey(table: string, field: string): string {
    return `${table}:unique:${field}`;
  }

  static async isUnique(
    table: string,
    field: string,
    value: string
  ): Promise<boolean> {
    const key = this.getUniqueKey(table, field);
    const exists = await redis.sismember(key, value);
    return exists === 0;
  }

  static async addUnique(
    table: string,
    field: string,
    value: string
  ): Promise<boolean> {
    const key = this.getUniqueKey(table, field);
    const added = await redis.sadd(key, value);
    return added === 1;
  }

  static async removeUnique(
    table: string,
    field: string,
    value: string
  ): Promise<void> {
    const key = this.getUniqueKey(table, field);
    await redis.srem(key, value);
  }
}
