import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PaidEvent } from "@app/presentation/event/payment/paid.event";
import {
  PaymentProducer,
  PaymentProducerSymbol,
} from "@app/domain/interface/message/payment/payment.producer";
import { Inject, Logger } from "@nestjs/common";
import PaymentTopicEnum from "@app/domain/enum/message/payment/payment.topic.enum";
import PaidEventStatusEnum from "@app/domain/enum/entity/paid-event-status.enum";
import { UpdatePaidEventUseCase } from "@app/application/use-case/payment/update-paid-event.use-case";

@EventsHandler(PaidEvent)
export class PaidEventListener implements IEventHandler<PaidEvent> {
  private readonly logger = new Logger(PaidEventListener.name);

  constructor(
    @Inject(PaymentProducerSymbol)
    private readonly paymentProducer: PaymentProducer,
    @Inject() private readonly updatePaidEventUseCase: UpdatePaidEventUseCase,
  ) {}

  async handle(event: PaidEvent) {
    try {
      // 카프카 메시지 발행
      await this.paymentProducer.sendMessage(
        PaymentTopicEnum.PAID,
        event.message,
      );
    } catch (e) {
      this.logger.error(e);
      await this.handleError(event);
    }
  }

  async handleError(event: PaidEvent) {
    await this.updatePaidEventUseCase.execute(
      event.payment.id,
      PaidEventStatusEnum.SEND_FAIL,
    );
  }
}
