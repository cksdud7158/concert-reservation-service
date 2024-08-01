import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { WaitingQueueRepository } from "@app/domain/interface/repository/waiting-queue.repository";
import { RedisClientSymbol } from "@app/module/provider/redis.provider";
import Redis from "ioredis";
import RedisKey from "@app/domain/enum/redis-key.enum";

@Injectable()
export class WaitingQueueRepositoryImpl implements WaitingQueueRepository {
  constructor(@Inject(RedisClientSymbol) private readonly redis: Redis) {}

  async getActiveNum(): Promise<number> {
    const val = await this.redis.get(RedisKey.ACTIVE_NUM);
    return val ? Number(val) : 0;
  }

  async setActiveNum(num: number): Promise<void> {
    this.redis.set(RedisKey.ACTIVE_NUM, num);
  }

  async setActiveData(userId: number): Promise<void> {
    const key = this.getActiveTokenKey(userId);
    const res = await this.redis.set(key, userId, "EX", 60 * 15);

    if (!res) {
      throw new InternalServerErrorException("액티브 토큰 추가 실패" + userId);
    }
  }

  async setWaitingData(userId: number): Promise<void> {
    const timestamp = new Date().getTime();

    const res = await this.redis.zadd(
      RedisKey.WAITING_TOKENS,
      "NX",
      timestamp,
      userId,
    );

    if (res === 0) {
      throw new BadRequestException("이미 대기중 입니다.");
    }
  }

  async getWaitingNum(userId: number): Promise<number> {
    return this.redis.zrank(RedisKey.WAITING_TOKENS, userId);
  }

  private getActiveTokenKey(userId: number): string {
    return `${RedisKey.ACTIVE_TOKENS}-${userId}`;
  }
}
