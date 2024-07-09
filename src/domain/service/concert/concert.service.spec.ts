import { Test, TestingModule } from "@nestjs/testing";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import {
  ConcertScheduleRepository,
  ConcertScheduleRepositorySymbol,
} from "@app/domain/interface/repository/concert-schedule.repository";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";

describe("ConcertService", () => {
  let service: ConcertService;
  let concertScheduleRepository: jest.Mocked<ConcertScheduleRepository>;

  beforeAll(() => {
    // Modern fake timers 사용
    jest.useFakeTimers();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConcertService,
        {
          provide: ConcertScheduleRepositorySymbol,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ConcertService>(ConcertService);
    concertScheduleRepository = module.get(ConcertScheduleRepositorySymbol);
  });

  const concertId = 1;
  const date = new Date();

  const concertSchedule: Partial<ConcertSchedule> = {
    id: 1,
    creat_at: date,
    update_at: date,
    date: date,
    seats: [],
  };

  describe("콘서트 예약 가능 날짜 조회 method(getScheduleList)", () => {
    it("콘서트 날짜 조회 완료", async () => {
      // given

      //when

      jest
        .spyOn(concertScheduleRepository, "findById")
        .mockResolvedValue([concertSchedule]);
      const res = await service.getScheduleList(concertId);

      //then
      expect(res).toEqual([concertSchedule]);
    });
  });
});
