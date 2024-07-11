import { Test, TestingModule } from "@nestjs/testing";
import { PaymentController } from "@app/presentation/controller/payment/payment.controller";
import { PayRequest } from "@app/presentation/dto/payment/pay/pay.request";
import { PayUseCase } from "@app/application/use-case/payment/pay.use-case";
import { PaymentService } from "@app/domain/service/payment/payment.service";
import { PaymentRepositorySymbol } from "@app/domain/interface/repository/payment.repository";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { UserService } from "@app/domain/service/user/user.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { TicketRepositorySymbol } from "@app/domain/interface/repository/ticket.repository";
import { UserRepositorySymbol } from "@app/domain/interface/repository/user.repository";
import { PointHistoryRepositorySymbol } from "@app/domain/interface/repository/point-history.repository";
import { ConcertRepositorySymbol } from "@app/domain/interface/repository/concert.repository";
import { ConcertScheduleRepositorySymbol } from "@app/domain/interface/repository/concert-schedule.repository";
import { ConcertSeatRepositorySymbol } from "@app/domain/interface/repository/concert-seat.repository";
import { Payment } from "@app/infrastructure/entity/payment.entity";
import PaymentStatus from "@app/infrastructure/enum/payment-status.enum";
import { DataSource, EntityManager } from "typeorm";

describe("PaymentController", () => {
  let controller: PaymentController;
  let payUseCase: PayUseCase;
  let dataSourceMock: Partial<DataSource>;

  beforeEach(async () => {
    dataSourceMock = {
      manager: {} as EntityManager,
      createEntityManager: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        PayUseCase,
        PaymentService,
        ReservationService,
        UserService,
        ConcertService,
        { provide: DataSource, useValue: dataSourceMock },

        {
          provide: PaymentRepositorySymbol,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: TicketRepositorySymbol,
          useValue: {
            insert: jest.fn(),
            findByIds: jest.fn(),
            findByIdsAndUserId: jest.fn(),
          },
        },
        {
          provide: UserRepositorySymbol,
          useValue: {
            findOneById: jest.fn(),
            findOnePointById: jest.fn(),
            updatePoint: jest.fn(),
          },
        },
        {
          provide: PointHistoryRepositorySymbol,
          useValue: {
            insert: jest.fn(),
          },
        },
        {
          provide: ConcertRepositorySymbol,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ConcertScheduleRepositorySymbol,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: ConcertSeatRepositorySymbol,
          useValue: {
            findByIdWithScheduleId: jest.fn(),
            updatePendingToSale: jest.fn(),
            findByIdAndStatusSale: jest.fn(),
            updateStatus: jest.fn(),
            findByExpiredTime: jest.fn(),
          },
        },
      ],
    }).compile();

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
      const response: Partial<Payment> = {
        id: 1,
        creat_at: undefined,
        update_at: undefined,
        price: 10000,
        status: PaymentStatus.PAID,
        tickets: [],
      };

      //when
      jest.spyOn(payUseCase, "execute").mockResolvedValue(response);

      //then
      const res = await controller.pay(request);

      expect(res).toEqual(response);
    });
  });
});
