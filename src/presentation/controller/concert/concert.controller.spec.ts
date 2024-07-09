import { Test, TestingModule } from "@nestjs/testing";
import { ConcertController } from "@app/presentation/controller/concert/concert.controller";
import { GetScheduleListUseCase } from "@app/application/use-case/concert/get-schedule-list.use-case";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { GetScheduleListResponse } from "@app/presentation/dto/concert/get-schedule-list/get-schedule-list.response";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { ConcertScheduleRepositorySymbol } from "@app/domain/interface/repository/concert-schedule.repository";

describe("ConcertController", () => {
  let controller: ConcertController;
  let getScheduleListUseCase: GetScheduleListUseCase;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcertController],
      providers: [
        GetScheduleListUseCase,
        ConcertService,
        {
          provide: ConcertScheduleRepositorySymbol,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ConcertController>(ConcertController);
    getScheduleListUseCase = module.get<GetScheduleListUseCase>(
      GetScheduleListUseCase,
    );
  });

  const concertId = 1;
  const concertDateId = 1;
  const seatId = 1;
  const seatNum = 1;
  const date = new Date();

  const concertSchedule: Partial<ConcertSchedule> = {
    id: 1,
    creat_at: date,
    update_at: date,
    date: date,
    seats: [],
  };
  describe("/concerts/{concertId}/dates (GET)", () => {
    it("콘서트 예약 가능 날짜 조회 성공", async () => {
      //given
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

  describe("/concerts/{concertId}/dates/{concertDateId}/seats (GET)", () => {
    it("콘서트 좌석 정보 조회 성공", async () => {
      //given
      const response = {
        seats: [
          {
            seatId,
            seatNum,
            isReserved: false,
          },
        ],
      };

      //when

      //then
      const res = await controller.getSeatList(concertId, concertDateId);

      expect(res).toEqual(response);
    });
  });
});
