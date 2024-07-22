import { Inject, Injectable } from "@nestjs/common";
import { TokenService } from "@app/domain/service/token/token.service";
import { DataSource } from "typeorm";

@Injectable()
export class CheckWaitingQueuesUseCase {
  constructor(
    @Inject() private readonly tokenService: TokenService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(): Promise<void> {
    await this.dataSource.createEntityManager().transaction(async (manager) => {
      await this.tokenService.checkWaitingQueues(manager);
    });
  }
}
