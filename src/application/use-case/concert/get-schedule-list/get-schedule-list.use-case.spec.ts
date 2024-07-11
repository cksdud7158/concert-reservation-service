import { Test, TestingModule } from "@nestjs/testing";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { GetScheduleListUseCase } from "@app/application/use-case/concert/get-schedule-list/get-schedule-list.use-case";
import { InternalServerErrorException } from "@nestjs/common";

describe("GetScheduleListUseCase", () => {
  let getScheduleListUseCase: GetScheduleListUseCase;
  let concertService: ConcertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetScheduleListUseCase,
        {
          provide: ConcertService,
          useValue: {
            getScheduleList: jest.fn(),
          },
        },
      ],
    }).compile();

    getScheduleListUseCase = module.get<GetScheduleListUseCase>(
      GetScheduleListUseCase,
    );
    concertService = module.get<ConcertService>(ConcertService);
  });

  describe("스케쥴 조회 통합 테스트", () => {
    it("조회 성공", async () => {
      const concertId = 1;
      const schedules: Partial<ConcertSchedule>[] = [
        { id: 1, date: new Date("2024-07-20T19:00:00Z") },
        { id: 2, date: new Date("2024-07-21T19:00:00Z") },
      ];

      concertService.getScheduleList = jest.fn().mockResolvedValue(schedules);

      const result = await getScheduleListUseCase.execute(concertId);

      expect(concertService.getScheduleList).toHaveBeenCalledWith(concertId);
      expect(result).toBe(schedules);
    });

    it("조회 실패", async () => {
      const concertId = 1;
      const error = new InternalServerErrorException();

      concertService.getScheduleList = jest.fn().mockRejectedValue(error);

      await expect(getScheduleListUseCase.execute(concertId)).rejects.toThrow(
        error,
      );

      expect(concertService.getScheduleList).toHaveBeenCalledWith(concertId);
    });
  });
});
