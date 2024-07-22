import { Inject, Injectable } from "@nestjs/common";
import { TokenService } from "@app/domain/service/token/token.service";
import WaitingQueueEntity from "@app/domain/entity/waiting-queue.entity";

@Injectable()
export class GetWaitingStatusUseCase {
  constructor(@Inject() private readonly tokenService: TokenService) {}

  async execute(userId: number): Promise<WaitingQueueEntity> {
    return await this.tokenService.getWaitingQueue(userId);
  }
}
