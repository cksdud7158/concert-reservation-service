import Redis from "ioredis";

export const RedisClientSymbol = Symbol.for("REDIS_CLIENT");

const redisProvider = {
  provide: RedisClientSymbol,
  useFactory: () => {
    const redis = new Redis({
      host: "localhost",
      port: 6379,
      password: "concert",
    });
    return redis;
  },
};

export default redisProvider;
