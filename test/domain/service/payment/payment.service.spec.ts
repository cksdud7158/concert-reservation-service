import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "@app/domain/service/payment/payment.service";
import {
  PaymentRepository,
  PaymentRepositorySymbol,
} from "@app/domain/interface/repository/payment.repository";
import { Payment } from "@app/infrastructure/entity/payment.entity";
import PaymentStatus from "@app/infrastructure/enum/payment-status.enum";
import { mockPaymentProvider } from "../../../mock/repositroy-mocking/payment-repository.mock";

describe("PaymentService", () => {
  let service: PaymentService;
  let paymentRepository: PaymentRepository;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentService, mockPaymentProvider],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    paymentRepository = module.get(PaymentRepositorySymbol);
  });

  describe("결제 method(pay)", () => {
    it("결제 완료", async () => {
      // given
      const userId = 1;
      const ticketIds = [1, 2];
      const price = 1000;

      const payment: Partial<Payment> = {
        id: 1,
        creat_at: undefined,
        update_at: undefined,
        price: 10000,
        status: PaymentStatus.PAID,
        tickets: [],
      };

      //when
      //
      jest.spyOn(paymentRepository, "findOneById").mockResolvedValue(payment);
      const res = await service.pay(userId, ticketIds, price);

      //then
      expect(res).toEqual(payment);
    });
  });
});
