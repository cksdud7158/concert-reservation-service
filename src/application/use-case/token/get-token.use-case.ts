import { Inject, Injectable } from "@nestjs/common";
import { UserService } from "@app/domain/service/user/user.service";
import { TokenService } from "@app/domain/service/token/token.service";
import { DataSource } from "typeorm";

@Injectable()
export class GetTokenUseCase {
  constructor(
    @Inject() private readonly tokenService: TokenService,
    @Inject() private readonly userService: UserService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(userId: number): Promise<string> {
    // 해당 유저 있는지 확인
    await this.userService.hasUser(userId);

    return await this.dataSource
      .createEntityManager()
      .transaction(async (manager) => {
        const token = await this.tokenService.getToken(userId, manager);

        return token;
      });
  }
}
