import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import RedisKey from "@app/domain/enum/redis-key.enum";
import { RedisClientSymbol } from "@app/module/provider/redis.provider";
import Redis from "ioredis";
import { PayloadType } from "@app/domain/type/token/payload.type";
import {
  WaitingQueueRepository,
  WaitingQueueRepositorySymbol,
} from "@app/domain/interface/repository/waiting-queue.repository";

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

    // key ActiveNum 에 저장된 num 체크
    const activeNum = await this.waitingQueueRepository.getActiveNum();

    // 일정 숫자 이하면 바로 Active Tokens 에 저장
    if (activeNum < 4) {
      await this.waitingQueueRepository.setActiveData(userId);
      await this.waitingQueueRepository.setActiveNum(activeNum + 1);
    }
    // 이상이면 Waiting Tokens 에 저장
    else {
      await this.waitingQueueRepository.setWaitingData(userId);
      orderNum = (await this.waitingQueueRepository.getWaitingNum(userId)) + 1;
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
  async isAvailable(payload: PayloadType): Promise<void> {
    // PENDING or EXPIRED 상태면 막기
    if (payload.status === WaitingQueueStatus.PENDING) {
      throw new BadRequestException(`대기번호 ${payload.orderNum}번 입니다.`);
    }

    if (payload.status === WaitingQueueStatus.EXPIRED) {
      throw new BadRequestException("만료된 토큰입니다.");
    }

    const userId = payload.userId;

    // ActiveTokens 에서 토큰 확인 -> 없으면 만료된 것
    await this.waitingQueueRepository.hasActiveData(userId);

    // 만료 안됐으면 TTL 연장
    await this.waitingQueueRepository.setActiveData(userId);
  }

  // 스케쥴용
  async checkWaitingQueues(): Promise<void> {
    // active tokens 에서 만료된 토큰 삭제
    await this.removeExpiredActiveTokens();

    // waiting tokens 에서 일정 인원 active tokens 로 삽입
    await this.waitingTokensToActiveTokens();

    return;
  }

  // 토큰 만료 처리
  async changeToExpired(userId: number): Promise<void> {
    const activeToken = await this.getToken(userId);

    if (!activeToken) {
      throw new InternalServerErrorException();
    }
    await this.removeActiveToken([activeToken]);
  }

  // 토큰 정보 조회
  async getWaitingQueue(userId: number): Promise<string> {
    let orderNum = 0;
    let status = WaitingQueueStatus.AVAILABLE;

    // Active tokens 에서 데이터 조회
    const activeToken = await this.getActiveToken(userId);

    // 없으면 Waiting tokens 에서 순서 조회
    if (!activeToken) {
      orderNum = (await this.getOrderNum(userId)) + 1;
      status = WaitingQueueStatus.PENDING;
    }

    return this.jwtService.signAsync({
      userId,
      orderNum,
      status,
    });
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

  private async getOrderNum(userId: number): Promise<number> {
    return this.redis.zrank(RedisKey.WAITING_TOKENS, userId);
  }

  private async getActiveToken(userId: number): Promise<string> {
    const memberList = await this.redis.smembers(RedisKey.ACTIVE_TOKENS);
    const activeToken = memberList.find((member) =>
      member.startsWith(userId + ""),
    );

    return activeToken;
  }

  private async removeActiveToken(tokens: string[]): Promise<void> {
    const res = await this.redis.srem(RedisKey.ACTIVE_TOKENS, ...tokens);
    if (!res) {
      throw new InternalServerErrorException("액티브 토큰 삭제 실패" + tokens);
    }
  }

  private async updateActiveToken(token: string): Promise<void> {
    await this.removeActiveToken([token]);

    const userId = parseInt(token.split("::")[0]);
    await this.setActiveToken([userId]);
  }

  private async removeExpiredActiveTokens(): Promise<void> {
    // Active Tokens 데이터 조회
    const memberList = await this.redis.smembers(RedisKey.ACTIVE_TOKENS);

    if (!memberList.length) return;

    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;

    // 10분 지난 데이터만 필터링
    const filteredMemberList = memberList.filter((member) => {
      const [_, timestamp] = member.split("::");
      // 10분 지났는지 확인
      return Number(timestamp) < tenMinutesAgo;
    });

    if (!filteredMemberList.length) return;

    // 해당 데이터 삭제
    await this.removeActiveToken(filteredMemberList);
  }

  private async removeWaitingToken(tokens: number[]) {
    const res = await this.redis.zrem(RedisKey.WAITING_TOKENS, ...tokens);
    if (!res) {
      throw new InternalServerErrorException("대기열 토큰 삭제 실패" + tokens);
    }
  }

  private async waitingTokensToActiveTokens(): Promise<void> {
    // Waiting Tokens 50명씩 불러오기
    const waitingTokens = (
      await this.redis.zrange(RedisKey.WAITING_TOKENS, 0, 5)
    ).map((token) => Number(token));

    if (!waitingTokens.length) return;

    // Active Tokens 에 삽입
    await this.setActiveToken(waitingTokens);

    // Waiting Tokens 에서 삭제
    await this.removeWaitingToken(waitingTokens);
  }
}
