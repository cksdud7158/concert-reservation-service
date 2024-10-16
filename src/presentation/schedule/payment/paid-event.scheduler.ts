import { Inject, Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { SendMessageUseCase } from "@app/application/use-case/payment/send-message.use-case";

@Injectable()
export class PaidEventScheduler {
  private readonly logger = new Logger(PaidEventScheduler.name);

  constructor(
    @Inject()
    private readonly sendMessageUseCase: SendMessageUseCase,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES, { name: "sendMessage" })
  async sendMessage() {
    this.logger.log("스케쥴러 sendMessage 실행");
    await this.sendMessageUseCase.execute();
  }
}
