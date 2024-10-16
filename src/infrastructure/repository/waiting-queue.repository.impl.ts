import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { WaitingQueueRepository } from "@app/domain/interface/repository/waiting-queue.repository";
import { RedisClientSymbol } from "@app/module/provider/redis/redis.provider";
import Redis from "ioredis";
import RedisKey from "@app/domain/enum/redis/redis-key.enum";

@Injectable()
export class WaitingQueueRepositoryImpl implements WaitingQueueRepository {
  private readonly limit = 500; // 허용할 최대 요청 수
  private readonly timeframe = 30; // 시간 프레임 (초 단위)

  constructor(@Inject(RedisClientSymbol) private readonly redis: Redis) {}

  async isRequestAllowed(): Promise<boolean> {
    const key = RedisKey.THROTTLING;
    const currentCount = await this.redis.incr(key);

    if (currentCount === 1) {
      // 최초 요청이므로 타임프레임 설정
      await this.redis.set(key, 1, "EX", this.timeframe);
    }

    return currentCount <= this.limit;
  }

  async hasActiveUser(userId: number): Promise<boolean> {
    const key = this.getActiveUserKey(userId);
    const res = await this.redis.get(key);
    return !!res;
  }

  async setActiveUser(userId: number): Promise<void> {
    const key = this.getActiveUserKey(userId);
    const res = await this.redis.set(key, userId, "EX", 60 * 15);

    if (!res) {
      throw new InternalServerErrorException("액티브 유저 추가 실패" + userId);
    }
  }

  async removeActiveUser(userId: number): Promise<void> {
    const key = this.getActiveUserKey(userId);
    await this.redis.del(key);
  }

  async setWaitingUser(userId: number): Promise<void> {
    const timestamp = new Date().getTime();

    const res = await this.redis.zadd(
      RedisKey.WAITING_USERS,
      "NX",
      timestamp,
      userId,
    );

    if (res === 0) {
      throw new BadRequestException("이미 대기중 입니다.");
    }
  }

  async getWaitingNum(userId: number): Promise<number> {
    return this.redis.zrank(RedisKey.WAITING_USERS, userId);
  }

  async getWaitingUsers(maxNum: number): Promise<number[]> {
    return (await this.redis.zrange(RedisKey.WAITING_USERS, 0, maxNum)).map(
      (userId) => Number(userId),
    );
  }

  async removeWaitingUsers(userIds: number[]): Promise<void> {
    const res = await this.redis.zrem(RedisKey.WAITING_USERS, ...userIds);
    if (!res) {
      throw new InternalServerErrorException("대기열 유저 삭제 실패" + userIds);
    }
  }

  private getActiveUserKey(userId: number): string {
    return `${RedisKey.ACTIVE_USERS}-${userId}`;
  }
}
