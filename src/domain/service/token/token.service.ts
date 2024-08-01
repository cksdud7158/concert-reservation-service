import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import { RedisClientSymbol } from "@app/module/provider/redis.provider";
import Redis from "ioredis";
import { PayloadType } from "@app/domain/type/token/payload.type";
import {
  WaitingQueueRepository,
  WaitingQueueRepositorySymbol,
} from "@app/domain/interface/repository/waiting-queue.repository";
import RedisKey from "@app/domain/enum/redis-key.enum";

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
      await this.waitingQueueRepository.setActiveUser(userId);
      await this.waitingQueueRepository.setActiveNum(activeNum + 1);
    }
    // 이상이면 Waiting Tokens 에 저장
    else {
      await this.waitingQueueRepository.setWaitingUser(userId);
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
      throw new BadRequestException("만료된 유저입니다.");
    }

    const userId = payload.userId;

    // ActiveTokens 에서 토큰 확인 -> 없으면 만료된 것
    const hasActiveUser =
      await this.waitingQueueRepository.hasActiveUser(userId);
    if (!hasActiveUser) {
      throw new BadRequestException("만료된 유저입니다.");
    }

    // 만료 안됐으면 TTL 연장
    await this.waitingQueueRepository.setActiveUser(userId);
  }

  // 스케쥴용 (waiting 에서 일정 인원 active 로 변경)
  async changeToActive(): Promise<void> {
    // Waiting users 50명씩 불러오기
    const userIdList = await this.waitingQueueRepository.getWaitingUsers(50);

    if (!userIdList.length) return;

    let activeNum = await this.waitingQueueRepository.getActiveNum();
    // Active user 삽입
    for (const userId of userIdList) {
      await this.waitingQueueRepository.setActiveUser(userId);
      activeNum++;
      await this.waitingQueueRepository.setActiveNum(activeNum);
    }

    // Waiting users 에서 삭제
    await this.waitingQueueRepository.removeWaitingUsers(userIdList);
  }

  // 토큰 만료 처리
  async changeToExpired(userId: number): Promise<void> {
    const activeToken = await this.getToken(userId);

    if (!activeToken) {
      throw new InternalServerErrorException();
    }
    await this.removeActiveToken([activeToken]);
  }

  // 토큰 리프레쉬
  async refreshToken(user: PayloadType): Promise<string> {
    // 이용 가능 상태면 TTL 만 연장
    if (user.status === WaitingQueueStatus.AVAILABLE) {
      await this.waitingQueueRepository.setActiveUser(user.userId);
    } else {
      // user.status 가 대기 상태면 active 에 있는지 확인
      const hasActiveUser = await this.waitingQueueRepository.hasActiveUser(
        user.userId,
      );

      if (hasActiveUser) {
        user.status = WaitingQueueStatus.AVAILABLE;
        await this.waitingQueueRepository.setActiveUser(user.userId);
      } else {
        // 대기 번호 조회
        user.orderNum =
          (await this.waitingQueueRepository.getWaitingNum(user.userId)) + 1;
      }
    }

    return this.jwtService.signAsync({
      userId: user.userId,
      orderNum: user.orderNum,
      status: user.status,
    });
  }

  private async removeActiveToken(tokens: string[]): Promise<void> {
    const res = await this.redis.srem(RedisKey.ACTIVE_USERS, ...tokens);
    if (!res) {
      throw new InternalServerErrorException("액티브 토큰 삭제 실패" + tokens);
    }
  }
}
