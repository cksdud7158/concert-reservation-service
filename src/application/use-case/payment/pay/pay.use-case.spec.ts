import { Test, TestingModule } from "@nestjs/testing";
import { PaymentService } from "@app/domain/service/payment/payment.service";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { UserService } from "@app/domain/service/user/user.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { DataSource, QueryRunner, EntityManager } from "typeorm";
import ConcertScheduleStatus from "@app/infrastructure/enum/concert-seat-status.enum";
import { PayUseCase } from "@app/application/use-case/payment/pay/pay.use-case";

describe("PayUseCase", () => {
  let payUseCase: PayUseCase;
  let paymentService: PaymentService;
  let reservationService: ReservationService;
  let userService: UserService;
  let concertService: ConcertService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PayUseCase,
        {
          provide: PaymentService,
          useValue: {
            pay: jest.fn(),
          },
        },
        {
          provide: ReservationService,
          useValue: {
            getTicketList: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            usePoint: jest.fn(),
          },
        },
        {
          provide: ConcertService,
          useValue: {
            checkExpiredTime: jest.fn(),
            changeStatus: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              manager: {},
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
            }),
          },
        },
      ],
    }).compile();

    payUseCase = module.get<PayUseCase>(PayUseCase);
    paymentService = module.get<PaymentService>(PaymentService);
    reservationService = module.get<ReservationService>(ReservationService);
    userService = module.get<UserService>(UserService);
    concertService = module.get<ConcertService>(ConcertService);
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
    manager = queryRunner.manager;
  });

  describe("결제 통합 테스트", () => {
    it("결제 성공", async () => {
      const userId = 1;
      const ticketIds = [1, 2, 3];
      const tickets = [
        { seat: { id: 1, price: 100 } },
        { seat: { id: 2, price: 150 } },
        { seat: { id: 3, price: 200 } },
      ];
      const totalPrice = tickets.reduce((pv, cv) => pv + cv.seat.price, 0);
      const payment = { id: 1 };

      reservationService.getTicketList = jest.fn().mockResolvedValue(tickets);
      concertService.checkExpiredTime = jest.fn().mockResolvedValue(true);
      userService.usePoint = jest.fn().mockResolvedValue(true);
      concertService.changeStatus = jest.fn().mockResolvedValue(true);
      paymentService.pay = jest.fn().mockResolvedValue(payment);

      const result = await payUseCase.execute(userId, ticketIds);

      expect(reservationService.getTicketList).toHaveBeenCalledWith(
        userId,
        ticketIds,
      );
      expect(concertService.checkExpiredTime).toHaveBeenCalledWith([1, 2, 3]);
      expect(userService.usePoint).toHaveBeenCalledWith(
        userId,
        totalPrice,
        manager,
      );
      expect(concertService.changeStatus).toHaveBeenCalledWith(
        [1, 2, 3],
        ConcertScheduleStatus.SOLD_OUT,
        manager,
      );
      expect(paymentService.pay).toHaveBeenCalledWith(
        userId,
        ticketIds,
        totalPrice,
        manager,
      );
      expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(result).toBe(payment);
    });

    it("결제 실패시 롤백 처리", async () => {
      const userId = 1;
      const ticketIds = [1, 2, 3];
      const tickets = [
        { seat: { id: 1, price: 100 } },
        { seat: { id: 2, price: 150 } },
        { seat: { id: 3, price: 200 } },
      ];
      const totalPrice = tickets.reduce((pv, cv) => pv + cv.seat.price, 0);
      const error = new Error("test error");

      reservationService.getTicketList = jest.fn().mockResolvedValue(tickets);
      concertService.checkExpiredTime = jest.fn().mockResolvedValue(true);
      userService.usePoint = jest.fn().mockRejectedValue(error);

      await expect(payUseCase.execute(userId, ticketIds)).rejects.toThrow(
        error,
      );

      expect(reservationService.getTicketList).toHaveBeenCalledWith(
        userId,
        ticketIds,
      );
      expect(concertService.checkExpiredTime).toHaveBeenCalledWith([1, 2, 3]);
      expect(userService.usePoint).toHaveBeenCalledWith(
        userId,
        totalPrice,
        manager,
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});
