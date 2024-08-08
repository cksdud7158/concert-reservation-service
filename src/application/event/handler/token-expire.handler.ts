import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { PayCompletedEvent } from "@app/application/event/pay-completed.event";
import { Inject } from "@nestjs/common";
import { TokenService } from "@app/domain/service/token/token.service";

@EventsHandler(PayCompletedEvent)
export class TokenExpireHandler implements IEventHandler<PayCompletedEvent> {
  constructor(@Inject() private readonly tokenService: TokenService) {}

  async handle(event: PayCompletedEvent) {
    try {
      // 대기열 만료 처리
      await this.tokenService.removeActiveUser(event.payment.user.id);
    } catch (e) {
      console.log(e);
    }
  }
}
