import { Body, Controller, Param, Post } from "@nestjs/common";
import { PayRequest } from "../../application/payment/dto/request/pay.request";

@Controller("payment")
export class PaymentController {
  @Post(":paymentId")
  async pay(
    @Param("paymentId") paymentId: number,
    @Body() payRequest: PayRequest,
  ): Promise<any> {
    return {
      paymentId: 1,
      status: 1,
      paymentPrice: 1000,
      balance: 300,
    };
  }
}
