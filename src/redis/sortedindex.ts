import { redis } from "./client";

export class RedisSortedIndex {
  static key(table: string, field: string) {
    return `${table}:sorted:${field}`;
  }

  static async add(table: string, field: string, id: string, score: number) {
    const key = this.key(table, field);
    await redis.zadd(key, score, id);
  }

  static async range(
    table: string,
    field: string,
    min: number,
    max: number
  ): Promise<string[]> {
    const key = this.key(table, field);
    return await redis.zrangebyscore(key, min, max);
  }

  static async topN(
    table: string,
    field: string,
    count = 10
  ): Promise<string[]> {
    const key = this.key(table, field);
    return await redis.zrevrange(key, 0, count - 1);
  }

  static async remove(table: string, field: string, id: string) {
    const key = this.key(table, field);
    await redis.zrem(key, id);
  }
}
