import { Test, TestingModule } from "@nestjs/testing";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { GetConcertListUseCase } from "@app/application/use-case/concert/get-concert-list/get-concert-list.use-case";

describe("GetConcertListUseCase", () => {
  let getConcertListUseCase: GetConcertListUseCase;
  let concertService: ConcertService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetConcertListUseCase,
        {
          provide: ConcertService,
          useValue: {
            getConcertList: jest.fn(),
          },
        },
      ],
    }).compile();

    getConcertListUseCase = module.get<GetConcertListUseCase>(
      GetConcertListUseCase,
    );
    concertService = module.get<ConcertService>(ConcertService);
  });

  const date = new Date();
  describe("콘서트 목록 조회 통합 테스트", () => {
    it("조회 성공", async () => {
      const concerts = [
        {
          id: 1,
          creat_at: date,
          update_at: date,
          name: "콘서트1",
        } as Concert,
      ];

      concertService.getConcertList = jest.fn().mockResolvedValue(concerts);

      const result = await getConcertListUseCase.execute();

      expect(concertService.getConcertList).toHaveBeenCalled();
      expect(result).toBe(concerts);
    });

    it("조회 실패", async () => {
      const error = new Error("test error");

      concertService.getConcertList = jest.fn().mockRejectedValue(error);

      await expect(getConcertListUseCase.execute()).rejects.toThrow(error);

      expect(concertService.getConcertList).toHaveBeenCalled();
    });
  });
});
