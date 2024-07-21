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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;
    try {
      // 토큰 발급
      const token = await this.tokenService.getToken(userId, manager);

      await queryRunner.commitTransaction();

      return token;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
