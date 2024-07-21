import { Test, TestingModule } from "@nestjs/testing";
import { ConcertController } from "@app/presentation/controller/concert/concert.controller";
import { GetScheduleListUseCase } from "@app/application/use-case/concert/get-schedule-list/get-schedule-list.use-case";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { GetScheduleListResponse } from "@app/presentation/dto/concert/get-schedule-list/get-schedule-list.response";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import ConcertScheduleStatus from "@app/infrastructure/enum/concert-seat-status.enum";
import { GetSeatListResponse } from "@app/presentation/dto/concert/get-seat-list/get-seat-list.response";
import { GetSeatListUseCase } from "@app/application/use-case/concert/get-seat-list/get-seat-list.use-case";
import { GetConcertListUseCase } from "@app/application/use-case/concert/get-concert-list/get-concert-list.use-case";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { GetConcertListResponse } from "@app/presentation/dto/concert/get-concert-list/get-concert-list.response";
import { TokenGuard } from "@app/presentation/guard/token.guard";
import { mockConcertProvider } from "../../../mock/repositroy-mocking/concert-repository.mock";
import { mockConcertScheduleProvider } from "../../../mock/repositroy-mocking/concert-schedule-repository.mock";
import { mockConcertSeatProvider } from "../../../mock/repositroy-mocking/concert-seat-repository.mock";

describe("ConcertController", () => {
  let controller: ConcertController;
  let getScheduleListUseCase: GetScheduleListUseCase;
  let getSeatListUseCase: GetSeatListUseCase;
  let getConcertListUseCase: GetConcertListUseCase;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertController],
      providers: [
        GetScheduleListUseCase,
        GetSeatListUseCase,
        GetConcertListUseCase,
        ConcertService,
        mockConcertProvider,
        mockConcertScheduleProvider,
        mockConcertSeatProvider,
      ],
    })
      .overrideGuard(TokenGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<ConcertController>(ConcertController);
    getScheduleListUseCase = module.get<GetScheduleListUseCase>(
      GetScheduleListUseCase,
    );
    getSeatListUseCase = module.get<GetSeatListUseCase>(GetSeatListUseCase);
    getConcertListUseCase = module.get<GetConcertListUseCase>(
      GetConcertListUseCase,
    );
  });

  const concertId = 1;
  const concertDateId = 1;
  const date = new Date();

  describe("/concerts/{concertId}/dates (GET)", () => {
    it("콘서트 예약 가능 날짜 조회 성공", async () => {
      //given
      const concertSchedule: Partial<ConcertSchedule> = {
        id: 1,
        creat_at: date,
        update_at: date,
        date: date,
        seats: [],
      };

      const response: GetScheduleListResponse = {
        total: 1,
        schedules: [
          {
            id: 1,
            date: date,
          },
        ],
      };

      //when
      jest
        .spyOn(getScheduleListUseCase, "execute")
        .mockResolvedValue([concertSchedule]);

      //then
      const res = await controller.getScheduleList(concertId);

      expect(res).toEqual(response);
    });
  });

  describe("/concerts/dates/{concertDateId}/seats (GET)", () => {
    it("콘서트 좌석 정보 조회 성공", async () => {
      //given
      const concertSeat: Partial<ConcertSeat> = {
        id: 1,
        creat_at: date,
        update_at: date,
        status: ConcertScheduleStatus.SALE,
        price: 20000,
        seat_number: 1,
      };

      const response: GetSeatListResponse = {
        total: 1,
        seats: [
          {
            id: 1,
            seatNum: 1,
            status: ConcertScheduleStatus.SALE,
            price: 20000,
          },
        ],
      };

      //when
      jest
        .spyOn(getSeatListUseCase, "execute")
        .mockResolvedValue([concertSeat]);

      //then
      const res = await controller.getSeatList(concertDateId);

      expect(res).toEqual(response);
    });
  });

  describe("/concerts (GET)", () => {
    it("콘서트 목록 조회 성공", async () => {
      //given
      const concert = {
        id: 1,
        creat_at: date,
        update_at: date,
        name: "콘서트1",
      } as Concert;

      const response: GetConcertListResponse = {
        total: 1,
        concert: [{ ...concert }],
      };

      //when
      jest.spyOn(getConcertListUseCase, "execute").mockResolvedValue([concert]);

      //then
      const res = await controller.getConcertList();

      expect(res).toEqual(response);
    });
  });
});
