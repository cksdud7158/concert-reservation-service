import { Test, TestingModule } from "@nestjs/testing";
import { PaymentController } from "./payment.controller";

describe("PaymentController", () => {
  let controller: PaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  describe("/payment/{paymentId} (POST)", () => {
    it("결제 요청 성공", async () => {
      //given
      const paymentId = 1;
      const request = {
        userId: 1,
      };
      const response = {
        paymentId: 1,
        status: 1,
        paymentPrice: 1000,
        balance: 300,
      };

      //when

      //then
      const res = await controller.pay(paymentId, request);

      expect(res).toEqual(response);
    });
  });
});
