import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { RedisClientSymbol } from "@app/module/provider/redis/redis.provider";
import Redis from "ioredis";

@Injectable()
export class LockService {
  constructor(@Inject(RedisClientSymbol) private readonly redisClient: Redis) {}

  // Redis에서 Simple Lock을 구현하는 방법 중 하나는 SETNX 명령을 사용하는 것
  // SETNX는 SET if Not eXists의 약자로, 키가 존재하지 않는 경우에만 값을 설정
  async acquireLock(key: string, value: string, ttl?: number): Promise<void> {
    const result = await this.redisClient.set(
      key,
      value,
      "PX",
      ttl ?? 1000,
      "NX",
    );
    if (result !== "OK") {
      throw new BadRequestException("예약 불가");
    }
  }

  async releaseLock(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}
