import { Inject, Injectable } from "@nestjs/common";
import { PaymentEntity } from "@app/domain/entity/payment/payment.entity";
import { PaidEventService } from "@app/domain/service/payment/paid-event.service";
import PaidEventStatusEnum from "@app/domain/enum/entity/paid-event-status.enum";

@Injectable()
export class UpdatePaidEventUseCase {
  constructor(@Inject() private readonly paidEventService: PaidEventService) {}

  async execute(
    payment: PaymentEntity,
    status: PaidEventStatusEnum,
  ): Promise<void> {
    await this.paidEventService.updateStatus(payment, status);
  }
}
