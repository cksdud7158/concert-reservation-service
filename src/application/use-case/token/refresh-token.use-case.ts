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

  // async execute(userId: number): Promise<string> {
  //   return await this.tokenService.refresh(userId);
  // }
}
