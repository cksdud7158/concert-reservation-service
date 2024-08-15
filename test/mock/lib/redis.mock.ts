import { RedisClientSymbol } from "@app/module/provider/redis/redis.provider";

export const mockRedisProvider = {
  provide: RedisClientSymbol,
  useValue: {
    scard: jest.fn(),
    sadd: jest.fn(),
    zadd: jest.fn(),
    zrank: jest.fn(),
    smembers: jest.fn(),
    srem: jest.fn(),
  },
};
