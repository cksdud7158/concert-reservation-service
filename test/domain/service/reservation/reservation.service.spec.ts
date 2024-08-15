import { Test, TestingModule } from "@nestjs/testing";
import {
  TicketRepository,
  TicketRepositorySymbol,
} from "@app/domain/interface/repository/ticket.repository";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import ConcertScheduleStatus from "@app/domain/enum/entity/concert-seat-status.enum";
import { mockTicketProvider } from "../../../mock/repositroy-mocking/ticket-repository.mock";
import { TicketEntity } from "@app/domain/entity/ticket.entity";
import { ConcertEntity } from "@app/domain/entity/concert.entity";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";
import { ConcertSeatEntity } from "@app/domain/entity/concert-seat.entity";
import { datasourceProvider } from "../../../mock/lib/datasource.mock";

describe("ReservationService", () => {
  let service: ReservationService;
  let ticketRepository: jest.Mocked<TicketRepository>;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationService, mockTicketProvider, datasourceProvider],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    ticketRepository = module.get(TicketRepositorySymbol);
  });

  describe("티켓 발급 method(makeTickets)", () => {
    it("티켓 발급 완료", async () => {
      // given
      const date = new Date();
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

      //when
      jest.spyOn(ticketRepository, "save").mockResolvedValue(ticketList);

      const res = await service.makeTickets(1, 1, 1, [1, 2]);

      //then
      expect(res).toEqual(ticketList);
    });
  });
});
