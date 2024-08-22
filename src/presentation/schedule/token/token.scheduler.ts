import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { ChangeToActiveQueuesUseCase } from "@app/application/use-case/token/change-to-active-queues.use-case";

@Injectable()
export class TokenScheduler {
  private readonly logger = new Logger(TokenScheduler.name);
  constructor(
    @Inject()
    private readonly changeToActiveQueuesUseCase: ChangeToActiveQueuesUseCase,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async changeToActive() {
    this.logger.log("스케쥴러 changeToActiveQueuesUseCase 실행");
    await this.changeToActiveQueuesUseCase.execute();
  }
}
