import { Inject, Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CheckWaitingQueuesUseCase } from "@app/application/use-case/token/check-waiting-queues.use-case";

@Injectable()
export class TokenScheduler {
  constructor(
    @Inject()
    private readonly checkWaitingQueuesUseCase: CheckWaitingQueuesUseCase,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    await this.checkWaitingQueuesUseCase.execute();
  }
}
