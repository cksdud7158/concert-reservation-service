import { Inject, Injectable } from "@nestjs/common";
import { TokenService } from "@app/domain/service/token/token.service";

@Injectable()
export class GetWaitingStatusUseCase {
  constructor(@Inject() private readonly tokenService: TokenService) {}

  async execute(userId: number): Promise<string> {
    return await this.tokenService.getWaitingQueue(userId);
  }
}
