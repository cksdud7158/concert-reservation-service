import Redis from "ioredis";

export const RedisClientSymbol = Symbol.for("REDIS_CLIENT");

const redisProvider = {
  provide: RedisClientSymbol,
  useFactory: () => {
    const redis = new Redis({
      host: "redis",
      port: 6379,
    });
    return redis;
  },
};

export default redisProvider;
