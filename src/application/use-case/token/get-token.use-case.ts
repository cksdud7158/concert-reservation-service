import { Inject, Injectable } from "@nestjs/common";
import { UserService } from "@app/domain/service/user/user.service";
import { TokenService } from "@app/domain/service/token/token.service";

@Injectable()
export class GetTokenUseCase {
  constructor(
    @Inject() private readonly tokenService: TokenService,
    @Inject() private readonly userService: UserService,
  ) {}

  async execute(userId: number): Promise<string> {
    await this.userService.hasUser(userId);
    return await this.tokenService.getToken(userId);
  }
}
