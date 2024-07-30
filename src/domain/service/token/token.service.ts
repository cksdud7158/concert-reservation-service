import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  WaitingQueueRepository,
  WaitingQueueRepositorySymbol,
} from "@app/domain/interface/repository/waiting-queue.repository";
import { EntityManager } from "typeorm";
import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import WaitingQueuesEntity from "@app/domain/entity/waiting-queues.entity";
import WaitingQueueEntity from "@app/domain/entity/waiting-queue.entity";
import RedisKey from "@app/domain/enum/redis-key.enum";
import { RedisClientSymbol } from "@app/module/provider/redis.provider";
import Redis from "ioredis";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(WaitingQueueRepositorySymbol)
    private readonly waitingQueueRepository: WaitingQueueRepository,

    @Inject(RedisClientSymbol) private readonly redis: Redis,
  ) {}

  async getToken(userId: number): Promise<string> {
    let orderNum = 0;
    let status = WaitingQueueStatus.AVAILABLE;
    const timestamp = new Date().getTime();

    // Active Tokens 에 저장된 size 체크
    const size = await this.redis.scard(RedisKey.ACTIVE_TOKENS);

    // 일정 숫자 이하면 바로 Active Tokens 에 저장
    if (size < 4) {
      await this.setActiveToken([userId]);
    }
    // 이상이면 Waiting Tokens 에 저장
    else {
      await this.setWaitingToken(userId, timestamp);
      orderNum = (await this.getOrderNum(userId)) + 1;
      status = WaitingQueueStatus.PENDING;
    }

    // 상태 리턴
    return this.jwtService.signAsync({
      userId,
      orderNum,
      status,
    });
  }

  // 이용 가능 여부 확인
  async isAvailable(id: number, _manager?: EntityManager): Promise<void> {
    // 데이터 조회
    let waitingQueue = await this.waitingQueueRepository.findOneById(id);

    // 결과가 없거나 EXPIRED 상태면
    if (
      !waitingQueue.id ||
      waitingQueue.status === WaitingQueueStatus.EXPIRED
    ) {
      throw new BadRequestException("만료된 토큰입니다.");
    }

    // 이용 가능 상태면 update_at 업데이트
    waitingQueue.updateUpdateAt(new Date());
    waitingQueue = await this.waitingQueueRepository.save(
      waitingQueue,
      _manager,
    );

    // 대기 상태면
    if (waitingQueue.status === WaitingQueueStatus.PENDING) {
      throw new ServiceUnavailableException(
        `대기번호 ${waitingQueue.orderNum}번 입니다.`,
      );
    }
    // AVAILABLE 상태면 리턴
  }

  // 전체 상태 체크해서 상태 변경(스케쥴용)
  async checkWaitingQueues(
    _manager?: EntityManager,
  ): Promise<WaitingQueuesEntity> {
    // 만료 상태 아닌 목록 조회
    const waitingQueuesEntity =
      await this.waitingQueueRepository.findByNotExpiredStatus(_manager);

    waitingQueuesEntity.checkWaitingQueues();

    // 변경 사항 업데이트
    await this.waitingQueueRepository.updateEntities(
      waitingQueuesEntity,
      _manager,
    );

    return waitingQueuesEntity;
  }

  // 토큰 만료 처리
  async changeToExpired(userId: number, _manager?: EntityManager) {
    await this.waitingQueueRepository.updateStatusByUserId(
      userId,
      WaitingQueueStatus.EXPIRED,
      _manager,
    );
  }

  // 토큰 정보 조회
  async getWaitingQueue(
    id: number,
    _manager?: EntityManager,
  ): Promise<WaitingQueueEntity> {
    return await this.waitingQueueRepository.findOneById(id, _manager);
  }

  private async setActiveToken(userIds: number[]): Promise<void> {
    const tokenList = userIds.map((userId) =>
      [userId, new Date().getTime()].join("::"),
    );

    const res = await this.redis.sadd(RedisKey.ACTIVE_TOKENS, ...tokenList);

    if (!res) {
      throw new InternalServerErrorException(
        "액티브 토큰 추가 실패" + tokenList,
      );
    }
  }

  private async setWaitingToken(
    userId: number,
    timestamp: number,
  ): Promise<void> {
    const res = await this.redis.zadd(
      RedisKey.WAITING_TOKENS,
      "NX",
      timestamp,
      userId,
    );
    if (res === 0) {
      throw new BadRequestException("이미 토큰이 존재합니다.");
    }
  }

  private async getOrderNum(userId: number): Promise<number> {
    return this.redis.zrank(RedisKey.WAITING_TOKENS, userId);
  }
}
