import { Test, TestingModule } from "@nestjs/testing";
import { ReservationController } from "@app/presentation/controller/reservation/reservation.controller";
import ConcertScheduleStatus from "@app/domain/enum/entity/concert-seat-status.enum";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { JwtService } from "@nestjs/jwt";
import { TokenService } from "@app/domain/service/token/token.service";
import { TokenGuard } from "@app/presentation/guard/token.guard";
import { mockTicketProvider } from "../../../mock/repositroy-mocking/ticket-repository.mock";
import { mockConcertProvider } from "../../../mock/repositroy-mocking/concert-repository.mock";
import { mockConcertScheduleProvider } from "../../../mock/repositroy-mocking/concert-schedule-repository.mock";
import { mockConcertSeatProvider } from "../../../mock/repositroy-mocking/concert-seat-repository.mock";
import { datasourceProvider } from "../../../mock/lib/datasource.mock";
import { ReserveConcertUseCase } from "@app/application/use-case/reservation/reserve-concert.use-case";
import { TicketEntity } from "@app/domain/entity/ticket/ticket.entity";
import { ConcertEntity } from "@app/domain/entity/concert/concert.entity";
import { ConcertScheduleEntity } from "@app/domain/entity/concert/concert-schedule.entity";
import { ConcertSeatEntity } from "@app/domain/entity/concert/concert-seat.entity";
import { ReserveConcertResponse } from "@app/presentation/dto/reservation/reserve-concert/reserve-concert.response";
import { mockConcertScheduleCacheProvider } from "../../../mock/repositroy-mocking/concert-schedule-cache-repository.mock";
import { mockWaitingQueueProvider } from "../../../mock/repositroy-mocking/waiting-queue-repository.mock";

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
        mockTicketProvider,
        mockConcertProvider,
        mockConcertScheduleProvider,
        mockConcertScheduleCacheProvider,
        mockConcertSeatProvider,
        mockWaitingQueueProvider,
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
        new TicketEntity({
          concert: new ConcertEntity({
            id: 1,
            creat_at: date,
            update_at: date,
            name: "프로미스9",
          }),
          creat_at: undefined,
          id: 1,
          schedule: new ConcertScheduleEntity({
            id: 1,
            creat_at: date,
            update_at: date,
            date: date,
          }),
          seat: new ConcertSeatEntity({
            id: 1,
            creat_at: date,
            update_at: date,
            status: ConcertScheduleStatus.PENDING,
            price: 20000,
            seat_number: 1,
          }),
          status: undefined,
          update_at: undefined,
          user: undefined,
          version: 0,
        }),
      ];

      const response = ReserveConcertResponse.toResponse(ticketList);

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
