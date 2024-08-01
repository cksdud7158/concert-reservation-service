import { Inject, Injectable } from "@nestjs/common";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";
import { RedisClientSymbol } from "@app/module/provider/redis.provider";
import Redis from "ioredis";
import { ConcertScheduleCacheRepository } from "@app/domain/interface/cache/concert-schedule.cache.repository";
import RedisKey from "@app/domain/enum/redis-key.enum";

@Injectable()
export class ConcertScheduleCacheRepositoryImpl
  implements ConcertScheduleCacheRepository
{
  constructor(@Inject(RedisClientSymbol) private readonly redis: Redis) {}

  async findById(concertId: number): Promise<ConcertScheduleEntity[]> {
    const key = `${RedisKey.SCHEDULE}-${concertId}`;

    // 캐시 조회
    const cache = await this.redis.get(key);

    // 있으면 캐시 데이터 리턴
    if (!cache) {
      return null;
    }
    return JSON.parse(cache);
  }

  async insert(
    concertId: number,
    ConcertScheduleEntities: ConcertScheduleEntity[],
  ) {
    const key = `${RedisKey.SCHEDULE}-${concertId}`;

    this.redis.set(
      key,
      JSON.stringify(ConcertScheduleEntities),
      "EX",
      60 * 60,
      "NX",
    );
  }
}
