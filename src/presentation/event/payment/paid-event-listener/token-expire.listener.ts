// import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
// import { PayCompletedEvent } from "@app/presentation/message/payment/pay-completed.message";
// import { Inject } from "@nestjs/common";
// import { TokenService } from "@app/domain/service/token/token.service";
//
// @EventsHandler(PayCompletedEvent)
// export class TokenExpireListener implements IEventHandler<PayCompletedEvent> {
//   constructor(@Inject() private readonly tokenService: TokenService) {}
//
//   async handle(message: PayCompletedEvent) {
//     try {
//       // 대기열 만료 처리
//       console.log("토큰 만료");
//       await this.tokenService.removeActiveUser(message.payment.user.id);
//     } catch (e) {
//       console.log(e);
//     }
//   }
// }
