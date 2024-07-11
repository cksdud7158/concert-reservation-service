import { Test, TestingModule } from "@nestjs/testing";
import { ReservationController } from "@app/presentation/controller/reservation/reservation.controller";
import { ReserveConcertUseCase } from "@app/application/use-case/reservation/reserve-concert.use-case";
import TicketStatus from "@app/infrastructure/enum/ticket-status.enum";
import ConcertSeatStatus from "@app/infrastructure/enum/concert-seat-status.enum";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { TicketRepositorySymbol } from "@app/domain/interface/repository/ticket.repository";
import { ConcertRepositorySymbol } from "@app/domain/interface/repository/concert.repository";
import { ConcertScheduleRepositorySymbol } from "@app/domain/interface/repository/concert-schedule.repository";
import { ConcertSeatRepositorySymbol } from "@app/domain/interface/repository/concert-seat.repository";
import { DataSource, EntityManager } from "typeorm";

describe("ReservationController", () => {
  let controller: ReservationController;
  let reserveConcertUseCase: ReserveConcertUseCase;
  let dataSourceMock: Partial<DataSource>;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    dataSourceMock = {
      manager: {} as EntityManager,
      createEntityManager: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        ReserveConcertUseCase,
        ReservationService,
        ConcertService,
        { provide: DataSource, useValue: dataSourceMock },
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
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    reserveConcertUseCase = module.get<ReserveConcertUseCase>(
      ReserveConcertUseCase,
    );
  });

  describe("/reservation (POST)", () => {
    it("콘서트 좌석 예매 성공", async () => {
      const date = new Date();
      //given
      const ticketList = [
        {
          id: 11,
          status: TicketStatus.PENDING,
          concert: {
            id: 1,
            creat_at: date,
            update_at: date,
            name: "프로미스9",
          } as Concert,
          schedule: {
            id: 1,
            creat_at: date,
            update_at: date,
            date: date,
          } as ConcertSchedule,
          seat: {
            id: 1,
            creat_at: date,
            update_at: date,
            status: ConcertSeatStatus.PENDING,
            price: 20000,
            seat_number: 1,
          } as ConcertSeat,
        },
      ];
      const response = {
        total: 1,
        tickets: [
          {
            id: 11,
            status: "PENDING",
            concert: {
              id: 1,
              creat_at: date,
              update_at: date,
              name: "프로미스9",
            },
            schedule: {
              id: 1,
              creat_at: date,
              update_at: date,
              date: date,
            },
            seat: {
              id: 1,
              creat_at: date,
              update_at: date,
              status: "PENDING",
              price: 20000,
              seat_number: 1,
            },
          },
        ],
      };

      //when
      jest
        .spyOn(reserveConcertUseCase, "execute")
        .mockResolvedValue(ticketList);

      //then
      const res = await controller.reserveConcert({
        userId: 1,
        concertId: 1,
        concertScheduleId: 1,
        seatIds: [1],
      });

      expect(res).toEqual(response);
    });
  });
});
