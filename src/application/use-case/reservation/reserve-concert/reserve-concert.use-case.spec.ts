import { ReserveConcertUseCase } from "@app/application/use-case/reservation/reserve-concert/reserve-concert.use-case";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { Test, TestingModule } from "@nestjs/testing";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { DataSource, EntityManager, QueryRunner } from "typeorm";
import ConcertSeatStatus from "@app/infrastructure/enum/concert-seat-status.enum";
import { BadRequestException } from "@nestjs/common";
import { TicketRepositorySymbol } from "@app/domain/interface/repository/ticket.repository";
import { ConcertRepositorySymbol } from "@app/domain/interface/repository/concert.repository";
import { ConcertScheduleRepositorySymbol } from "@app/domain/interface/repository/concert-schedule.repository";
import { ConcertSeatRepositorySymbol } from "@app/domain/interface/repository/concert-seat.repository";

describe("ReserveConcertUseCase", () => {
  let reserveConcertUseCase: ReserveConcertUseCase;
  let reservationService: ReservationService;
  let concertService: ConcertService;
  let dataSource: DataSource;
  let queryRunner: QueryRunner;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReserveConcertUseCase,
        ReservationService,
        ConcertService,
        {
          provide: TicketRepositorySymbol,
          useValue: {
            insert: jest.fn(),
            findByIds: jest.fn(),
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

    reserveConcertUseCase = module.get<ReserveConcertUseCase>(
      ReserveConcertUseCase,
    );
    reservationService = module.get<ReservationService>(ReservationService);
    concertService = module.get<ConcertService>(ConcertService);
    dataSource = module.get<DataSource>(DataSource);
    queryRunner = dataSource.createQueryRunner();
    manager = queryRunner.manager;
  });

  describe("예약 통합테스트", () => {
    it("예약 성공", async () => {
      const userId = 1;
      const concertId = 1;
      const concertScheduleId = 1;
      const seatIds = [1, 2, 3];
      const tickets = [{ id: 1 }, { id: 2 }, { id: 3 }];

      concertService.checkSaleSeat = jest.fn().mockResolvedValue(true);
      concertService.changeStatus = jest.fn().mockResolvedValue(true);
      reservationService.makeTickets = jest.fn().mockResolvedValue(tickets);

      const result = await reserveConcertUseCase.execute(
        userId,
        concertId,
        concertScheduleId,
        seatIds,
      );

      expect(concertService.checkSaleSeat).toHaveBeenCalledWith(seatIds);
      expect(concertService.changeStatus).toHaveBeenCalledWith(
        seatIds,
        ConcertSeatStatus.PENDING,
        manager,
      );
      expect(reservationService.makeTickets).toHaveBeenCalledWith(
        userId,
        concertId,
        concertScheduleId,
        seatIds,
        manager,
      );
      expect(queryRunner.rollbackTransaction).not.toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
      expect(result).toBe(tickets);
    });

    it("에러 발생 시 롤백 처리", async () => {
      const userId = 1;
      const concertId = 1;
      const concertScheduleId = 1;
      const seatIds = [1, 2, 3];
      const error = new BadRequestException();

      concertService.checkSaleSeat = jest.fn().mockResolvedValue(true);
      concertService.changeStatus = jest.fn().mockResolvedValue(true);
      reservationService.makeTickets = jest.fn().mockRejectedValue(error);

      await expect(
        reserveConcertUseCase.execute(
          userId,
          concertId,
          concertScheduleId,
          seatIds,
        ),
      ).rejects.toThrow(error);

      expect(concertService.checkSaleSeat).toHaveBeenCalledWith(seatIds);
      expect(concertService.changeStatus).toHaveBeenCalledWith(
        seatIds,
        ConcertSeatStatus.PENDING,
        manager,
      );
      expect(reservationService.makeTickets).toHaveBeenCalledWith(
        userId,
        concertId,
        concertScheduleId,
        seatIds,
        manager,
      );
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });
});
