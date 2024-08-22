import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import WaitingQueueStatus from "@app/domain/enum/entity/waiting-queue-status.enum";
import { PayloadType } from "@app/domain/type/token/payload.type";
import {
  WaitingQueueRepository,
  WaitingQueueRepositorySymbol,
} from "@app/domain/interface/repository/waiting-queue.repository";

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  constructor(
    private readonly jwtService: JwtService,
    @Inject(WaitingQueueRepositorySymbol)
    private readonly waitingQueueRepository: WaitingQueueRepository,
  ) {}

  async getToken(userId: number): Promise<string> {
    const start = Date.now(); // 시작 시간 기록
    let orderNum = 0;
    let status = WaitingQueueStatus.AVAILABLE;

    // 순식간에 요청이 몰렸는지 판단
    const isRequestAllowed =
      await this.waitingQueueRepository.isRequestAllowed();

    // 바로 Active Tokens 에 저장
    if (isRequestAllowed) {
      await this.waitingQueueRepository.setActiveUser(userId);
    }
    // Waiting Tokens 에 저장
    else {
      await this.waitingQueueRepository.setWaitingUser(userId);
      orderNum = (await this.waitingQueueRepository.getWaitingNum(userId)) + 1;
      status = WaitingQueueStatus.PENDING;
    }

    const end = Date.now(); // 종료 시간 기록
    const duration = end - start; // 처리 시간 계산

    this.logger.log(`${duration}ms`);
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

    // Active user 삽입
    for (const userId of userIdList) {
      await this.waitingQueueRepository.setActiveUser(userId);
    }

    // Waiting users 에서 삭제
    await this.waitingQueueRepository.removeWaitingUsers(userIdList);
  }

  // 토큰 만료 처리
  async removeActiveUser(userId: number): Promise<void> {
    await this.waitingQueueRepository.removeActiveUser(userId);
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
}
