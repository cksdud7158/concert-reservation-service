import { Test, TestingModule } from "@nestjs/testing";
import { ReservationController } from "@app/presentation/controller/reservation/reservation.controller";
import TicketStatus from "@app/domain/enum/ticket-status.enum";
import ConcertSeatStatus from "@app/domain/enum/concert-seat-status.enum";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "@app/domain/service/token/token.service";
import { TokenGuard } from "@app/presentation/guard/token.guard";
import { mockWaitingQueueProvider } from "../../../mock/repositroy-mocking/waiting-queue-repository.mock";
import { mockTicketProvider } from "../../../mock/repositroy-mocking/ticket-repository.mock";
import { mockConcertProvider } from "../../../mock/repositroy-mocking/concert-repository.mock";
import { mockConcertScheduleProvider } from "../../../mock/repositroy-mocking/concert-schedule-repository.mock";
import { mockConcertSeatProvider } from "../../../mock/repositroy-mocking/concert-seat-repository.mock";
import { datasourceProvider } from "../../../mock/lib/datasource.mock";
import { ReserveConcertUseCase } from "@app/application/use-case/reservation/reserve-concert.use-case";

describe("ReservationController", () => {
  let controller: ReservationController;
  let reserveConcertUseCase: ReserveConcertUseCase;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        ReserveConcertUseCase,
        ReservationService,
        ConcertService,
        TokenService,
        JwtService,
        mockWaitingQueueProvider,
        mockTicketProvider,
        mockConcertProvider,
        mockConcertScheduleProvider,
        mockConcertSeatProvider,
        datasourceProvider,
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<ReservationController>(ReservationController);
    reserveConcertUseCase = module.get<ReserveConcertUseCase>(
      ReserveConcertUseCase,
    );
  });

  describe("/token (POST)", () => {
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
