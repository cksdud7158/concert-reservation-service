import { Test, TestingModule } from "@nestjs/testing";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { GetSeatListUseCase } from "@app/application/use-case/concert/get-seat-list/get-seat-list.use-case";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { InternalServerErrorException } from "@nestjs/common";

describe("GetSeatListUseCase", () => {
  let getSeatListUseCase: GetSeatListUseCase;
  let concertService: ConcertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetSeatListUseCase,
        {
          provide: ConcertService,
          useValue: {
            getSeatList: jest.fn(),
          },
        },
      ],
    }).compile();

    getSeatListUseCase = module.get<GetSeatListUseCase>(GetSeatListUseCase);
    concertService = module.get<ConcertService>(ConcertService);
  });

  describe("콘서트 좌석 조회 통합 테스트", () => {
    it("조회 성공", async () => {
      const concertId = 1;
      const concertScheduleId = 1;
      const seats: Partial<ConcertSeat>[] = [
        { id: 1, seat_number: 1, price: 100 },
        { id: 2, seat_number: 2, price: 150 },
      ];

      concertService.getSeatList = jest.fn().mockResolvedValue(seats);

      const result = await getSeatListUseCase.execute(
        concertId,
        concertScheduleId,
      );

      expect(concertService.getSeatList).toHaveBeenCalledWith(
        concertId,
        concertScheduleId,
      );
      expect(result).toBe(seats);
    });

    it("조회 실패", async () => {
      const concertId = 1;
      const concertScheduleId = 1;
      const error = new InternalServerErrorException();

      concertService.getSeatList = jest.fn().mockRejectedValue(error);

      await expect(
        getSeatListUseCase.execute(concertId, concertScheduleId),
      ).rejects.toThrow(error);

      expect(concertService.getSeatList).toHaveBeenCalledWith(
        concertId,
        concertScheduleId,
      );
    });
  });
});
