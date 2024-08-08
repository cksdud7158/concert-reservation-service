import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SendPaidMessageHandler } from "@app/application/event/handler/send-paid-message.handler";

@Module({
  imports: [CqrsModule],
  providers: [SendPaidMessageHandler],
  exports: [CqrsModule],
})
export class EventModule {}
