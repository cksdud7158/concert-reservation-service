import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PayCompletedEvent } from "@app/application/event/pay-completed.event";

@EventsHandler(PayCompletedEvent)
export class SendPaidMessageHandler
  implements IEventHandler<PayCompletedEvent>
{
  async handle(event: PayCompletedEvent) {
    try {
      // 결제 완료 메시지 전송 로직
      await this.delay(2000);
      console.log(`결제 완료 : ${JSON.stringify(event)}`);
    } catch (e) {
      console.log(e);
    }
  }

  delay(num?: number) {
    return new Promise<void>((resolve) => setTimeout(() => resolve(), num));
  }
}
