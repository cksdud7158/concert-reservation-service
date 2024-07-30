import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { CheckWaitingQueuesUseCase } from "@app/application/use-case/token/check-waiting-queues.use-case";

@Injectable()
export class TokenScheduler {
  private readonly logger = new Logger(TokenScheduler.name);
  constructor(
    @Inject()
    private readonly checkWaitingQueuesUseCase: CheckWaitingQueuesUseCase,
  ) {}

  @Cron("0 */3 * * * *")
  async checkWaitingQueues() {
    this.logger.log("스케쥴러 checkWaitingQueues 실행");
    await this.checkWaitingQueuesUseCase.execute();
  }
}
