import { Inject, Injectable } from "@nestjs/common";
import { TokenService } from "../../../domain/service/token/token.service";
import { UserService } from "../../../domain/service/user/user.service";

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
