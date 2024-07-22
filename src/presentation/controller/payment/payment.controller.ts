import { Body, Controller, Inject, Post, UseGuards } from "@nestjs/common";
import { PayRequest } from "@app/presentation/dto/payment/pay/pay.request";
import { Payment } from "@app/infrastructure/entity/payment.entity";
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  PartialType,
} from "@nestjs/swagger";
import { ApiTag } from "@app/config/swagger/api-tag-enum";
import { TokenGuard } from "@app/presentation/guard/token.guard";
import { PayUseCase } from "@app/application/use-case/payment/pay.use-case";

@Controller("payment")
@ApiTags(ApiTag.Payment)
export class PaymentController {
  constructor(@Inject() private readonly payUseCase: PayUseCase) {}

  @ApiOperation({ summary: "결제 요청 API" })
  @ApiOkResponse({
    description: "결제 완료",
    type: PartialType(Payment),
  })
  @Post("")
  @UseGuards(TokenGuard)
  async pay(@Body() payRequest: PayRequest): Promise<Partial<Payment>> {
    return await this.payUseCase.execute(
      payRequest.userId,
      payRequest.ticketIds,
    );
  }
}
