import { Inject, Injectable } from "@nestjs/common";
import { TokenService } from "@app/domain/service/token/token.service";
import { PayloadType } from "@app/domain/type/token/payload.type";

@Injectable()
export class RefreshTokenUseCase {
  constructor(@Inject() private readonly tokenService: TokenService) {}

  async execute(user: PayloadType): Promise<string> {
    return await this.tokenService.refreshToken(user);
  }
}
