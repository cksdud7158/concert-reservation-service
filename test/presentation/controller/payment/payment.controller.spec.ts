import { Test, TestingModule } from "@nestjs/testing";
import { PaymentController } from "@app/presentation/controller/payment/payment.controller";
import { PayRequest } from "@app/presentation/dto/payment/pay/pay.request";
import { PaymentService } from "@app/domain/service/payment/payment.service";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { UserService } from "@app/domain/service/user/user.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import PaymentStatus from "@app/domain/enum/entity/payment-status.enum";
import { TokenGuard } from "@app/presentation/guard/token.guard";
import { mockPaymentProvider } from "../../../mock/repositroy-mocking/payment-repository.mock";
import { mockTicketProvider } from "../../../mock/repositroy-mocking/ticket-repository.mock";
import { mockUserProvider } from "../../../mock/repositroy-mocking/user-repository.mock";
import { mockPointHistoryProvider } from "../../../mock/repositroy-mocking/point-history-repository.mock";
import { mockConcertProvider } from "../../../mock/repositroy-mocking/concert-repository.mock";
import { mockConcertSeatProvider } from "../../../mock/repositroy-mocking/concert-seat-repository.mock";
import { mockConcertScheduleProvider } from "../../../mock/repositroy-mocking/concert-schedule-repository.mock";
import { datasourceProvider } from "../../../mock/lib/datasource.mock";
import { PayUseCase } from "@app/application/use-case/payment/pay.use-case";
import { PaymentEntity } from "@app/domain/entity/payment/payment.entity";
import { TokenService } from "@app/domain/service/token/token.service";
import { JwtService } from "@nestjs/jwt";
import { eventbusProvider } from "../../../mock/lib/eventbus.mock";
import { mockConcertScheduleCacheProvider } from "../../../mock/repositroy-mocking/concert-schedule-cache-repository.mock";
import { mockWaitingQueueProvider } from "../../../mock/repositroy-mocking/waiting-queue-repository.mock";

describe("PaymentController", () => {
  let controller: PaymentController;
  let payUseCase: PayUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        PayUseCase,
        PaymentService,
        ReservationService,
        UserService,
        ConcertService,
        TokenService,
        JwtService,
        datasourceProvider,
        mockPaymentProvider,
        mockTicketProvider,
        mockUserProvider,
        mockPointHistoryProvider,
        mockConcertProvider,
        mockConcertSeatProvider,
        mockConcertScheduleProvider,
        mockConcertScheduleCacheProvider,
        mockWaitingQueueProvider,
        eventbusProvider,
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<PaymentController>(PaymentController);
    payUseCase = module.get<PayUseCase>(PayUseCase);
  });

  describe("/payment (POST)", () => {
    it("결제 요청 성공", async () => {
      //given
      const request: PayRequest = {
        userId: 1,
        ticketIds: [1, 2],
      };
      const response = new PaymentEntity({
        id: 1,
        creat_at: undefined,
        update_at: undefined,
        price: 10000,
        status: PaymentStatus.PAID,
      });

      //when
      jest.spyOn(payUseCase, "execute").mockResolvedValue(response);

      //then
      const res = await controller.pay(request);

      expect(res).toEqual(response);
    });
  });
});
