import { Inject, Injectable } from "@nestjs/common";
import { RedisClientSymbol } from "@app/module/provider/redis/redis.provider";
import Redis from "ioredis";
import { CacheRepository } from "@app/domain/interface/cache/cache.repository";

@Injectable()
export class CacheRepositoryImpl implements CacheRepository {
  constructor(@Inject(RedisClientSymbol) private readonly redis: Redis) {}

  async get(key: string) {
    // 캐시 조회
    const cache = await this.redis.get(key);

    // 있으면 캐시 데이터 리턴
    if (!cache) {
      return null;
    }
    return JSON.parse(cache);
  }

  async set(key: string, value: string) {
    this.redis.set(key, value, "EX", 10 * 60, "NX");
  }
}
