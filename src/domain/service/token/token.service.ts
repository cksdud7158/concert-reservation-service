import {
  BadRequestException,
  Inject,
  Injectable,
  ServiceUnavailableException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  WaitingQueueRepository,
  WaitingQueueRepositorySymbol,
} from "../../interface/repository/waiting-queue.repository";
import { EntityManager } from "typeorm";
import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";
import WaitingQueuesEntity from "@app/domain/entity/waiting-queues.entity";
import WaitingQueueEntity from "@app/domain/entity/waiting-queue.entity";

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject(WaitingQueueRepositorySymbol)
    private readonly waitingQueueRepository: WaitingQueueRepository,
  ) {}

  async getToken(userId: number, _manager?: EntityManager): Promise<string> {
    // 만료 상태 아닌 목록 조회
    const waitingQueuesEntity =
      await this.waitingQueueRepository.findByNotExpiredStatus(_manager);

    // 기존 queue 에 해당 유저가 활성 상태로 있으면 만료 상태로 변경
    const waitingQueueIdList = waitingQueuesEntity.findByUserId(userId);

    //있으면 만료 상태로 다 바꾸기
    if (waitingQueueIdList?.length) {
      await this.waitingQueueRepository.updateStatusToExpired(
        waitingQueueIdList,
        _manager,
      );
    }

    // 이용 가능 여부 확인
    const isAvailable = waitingQueuesEntity.isAvailable();

    // 대기 순번 확인
    const orderNum = isAvailable
      ? 0
      : waitingQueuesEntity.getPendingStatusLength() + 1;

    let waitingQueue = {
      user_id: userId,
      status: isAvailable
        ? WaitingQueueStatus.AVAILABLE
        : WaitingQueueStatus.PENDING,
      orderNum: orderNum,
    } as WaitingQueue;

    // 해당 상태로 테이블 insert
    waitingQueue = await this.waitingQueueRepository.save(
      waitingQueue,
      _manager,
    );

    return await this.jwtService.signAsync({ sub: waitingQueue.id });
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
}
