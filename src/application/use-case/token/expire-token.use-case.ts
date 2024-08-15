import { Inject, Injectable } from "@nestjs/common";
import { TokenService } from "@app/domain/service/token/token.service";

@Injectable()
export class ExpireTokenUseCase {
  constructor(@Inject() private readonly tokenService: TokenService) {}

  async execute(userId: number): Promise<void> {
    await this.tokenService.removeActiveUser(userId);
  }
}
