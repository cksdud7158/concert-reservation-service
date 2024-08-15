import { forwardRef, Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PaidEventListener } from "@app/presentation/event/payment/paid-event-listener/paid-event.listener";
import { KafkaModule } from "@app/module/event/kafka.module";
import { PaymentModule } from "@app/module/payment/payment.module";

@Module({
  imports: [CqrsModule, KafkaModule, forwardRef(() => PaymentModule)],
  providers: [PaidEventListener],
  exports: [CqrsModule],
})
export class EventModule {}
