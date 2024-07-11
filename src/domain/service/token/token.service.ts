import { Inject, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
  WaitingQueueRepository,
  WaitingQueueRepositorySymbol,
} from "../../interface/repository/waiting-queue.repository";
import { EntityManager } from "typeorm";

@Injectable()
export class TokenService {
  constructor(
    @Inject() private readonly jwtService: JwtService,
    @Inject(WaitingQueueRepositorySymbol)
    private readonly waitingQueueRepository: WaitingQueueRepository,
  ) {}

  async getToken(userId: number, _manager?: EntityManager): Promise<string> {
    // 만료 상태 아닌 목록 조회
    const waitingQueuesEntity =
      await this.waitingQueueRepository.findByStatusNotExpired(_manager);

    // 기존 queue 에 해당 유저가 활성 상태로 있으면 만료 상태로 변경
    const waitingQueueIdList = waitingQueuesEntity.findById(userId);

    //있으면 만료 상태로 다 바꾸기
    if (waitingQueueIdList?.length) {
      await this.waitingQueueRepository.updateStatusToExpired(
        waitingQueueIdList,
        _manager,
      );
    }

    // payload 생성
    const payload = waitingQueuesEntity.create(userId);

    // 해당 상태로 테이블 insert
    await this.waitingQueueRepository.insert(userId, payload.status, _manager);

    return await this.jwtService.signAsync(payload);
  }

  // async refresh(userId: number): Promise<string> {
  //
  //   return "";
  // }
}
