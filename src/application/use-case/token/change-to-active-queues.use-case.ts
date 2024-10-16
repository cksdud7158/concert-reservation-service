import { Inject, Injectable } from "@nestjs/common";
import { TokenService } from "@app/domain/service/token/token.service";

@Injectable()
export class ChangeToActiveQueuesUseCase {
  constructor(@Inject() private readonly tokenService: TokenService) {}

  async execute(): Promise<void> {
    await this.tokenService.changeToActive();
  }
}
