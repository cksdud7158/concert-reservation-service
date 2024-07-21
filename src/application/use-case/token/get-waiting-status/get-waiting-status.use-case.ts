import { Inject, Injectable } from "@nestjs/common";
import { TokenService } from "@app/domain/service/token/token.service";
import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";

@Injectable()
export class GetWaitingStatusUseCase {
  constructor(@Inject() private readonly tokenService: TokenService) {}

  async execute(userId: number): Promise<WaitingQueue> {
    return await this.tokenService.getWaitingQueue(userId);
  }
}
