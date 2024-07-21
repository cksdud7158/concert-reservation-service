import { Test, TestingModule } from "@nestjs/testing";
import {
  TicketRepository,
  TicketRepositorySymbol,
} from "@app/domain/interface/repository/ticket.repository";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import TicketStatus from "@app/infrastructure/enum/ticket-status.enum";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import ConcertSeatStatus from "@app/infrastructure/enum/concert-seat-status.enum";
import { User } from "@app/infrastructure/entity/user.entity";
import { mockTicketProvider } from "../../../mock/repositroy-mocking/ticket-repository.mock";

describe("ReservationService", () => {
  let service: ReservationService;
  let ticketRepository: jest.Mocked<TicketRepository>;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReservationService, mockTicketProvider],
    }).compile();

    service = module.get<ReservationService>(ReservationService);
    ticketRepository = module.get(TicketRepositorySymbol);
  });

  describe("티켓 발급 method(makeTickets)", () => {
    it("티켓 발급 완료", async () => {
      // given
      const date = new Date();
      const ticketList: Ticket[] = [
        {
          id: 11,
          status: TicketStatus.PENDING,
          creat_at: date,
          update_at: date,
          user: {} as User,
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

      //when
      jest.spyOn(ticketRepository, "findByIds").mockResolvedValue(ticketList);

      const res = await service.makeTickets(1, 1, 1, [1, 2]);

      //then
      expect(res).toEqual(ticketList);
    });
  });
});
