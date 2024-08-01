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

  async hasActiveUser(userId: number): Promise<void> {
    const key = this.getActiveUserKey(userId);
    const res = await this.redis.get(key);

    if (!res) {
      throw new BadRequestException("만료된 유저입니다.");
    }
  }

  async setActiveUser(userId: number): Promise<void> {
    const key = this.getActiveUserKey(userId);
    const res = await this.redis.set(key, userId, "EX", 60 * 15);

    if (!res) {
      throw new InternalServerErrorException("액티브 유저 추가 실패" + userId);
    }
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
