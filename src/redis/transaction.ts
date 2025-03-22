import { redis } from "./client";

export type RedisTransactionHandler = (
  multi: ReturnType<typeof redis.multi>
) => void;

export class RedisTransaction {
  static async execute(
    watchKeys: string[],
    handler: RedisTransactionHandler
  ): Promise<boolean> {
    await redis.watch(...watchKeys);
    const multi = redis.multi();
    handler(multi);
    const results = await multi.exec();
    return results !== null; // null → başka client araya girmiş
  }

  static async safeSetNX(key: string, value: string): Promise<boolean> {
    const success = await redis.set(key, value, "NX");
    return success === "OK";
  }
}
