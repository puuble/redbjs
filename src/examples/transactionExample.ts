import { RedisTransaction } from "../redis/transaction";

const ok = await RedisTransaction.execute(
  ["email:test@example.com"],
  (multi) => {
    multi.set("email:test@example.com", "user:1234", "NX");
    multi.hmset("user:1234", {
      email: "test@example.com",
      password: "hashed",
    });
  }
);

console.log("Transaction success:", ok);
