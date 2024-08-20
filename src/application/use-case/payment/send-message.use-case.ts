import { Inject, Injectable } from "@nestjs/common";
import { PaidEventService } from "@app/domain/service/payment/paid-event.service";

@Injectable()
export class SendMessageUseCase {
  constructor(@Inject() private readonly paidEventService: PaidEventService) {}

  async execute(): Promise<void> {
    await this.paidEventService.sendMessageNotSuccessStatus();
  }
}
