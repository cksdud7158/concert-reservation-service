import { Body, Controller, Inject, Post } from "@nestjs/common";
import { PayRequest } from "@app/presentation/dto/payment/pay/pay.request";
import { PayUseCase } from "@app/application/use-case/payment/pay.use-case";
import { Payment } from "@app/infrastructure/entity/payment.entity";

@Controller("payment")
export class PaymentController {
  constructor(@Inject() private readonly payUseCase: PayUseCase) {}

  @Post("")
  async pay(@Body() payRequest: PayRequest): Promise<Partial<Payment>> {
    return await this.payUseCase.execute(
      payRequest.userId,
      payRequest.ticketIds,
    );
  }
}
