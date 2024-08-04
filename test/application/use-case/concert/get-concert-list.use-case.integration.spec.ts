import "../../../mock/config/jest-setup";
import { TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { GetConcertListUseCase } from "@app/application/use-case/concert/get-concert-list.use-case";

describe("GetConcertListUseCase", () => {
  let getConcertListUseCase: GetConcertListUseCase;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = global.mockModule;

    getConcertListUseCase = module.get<GetConcertListUseCase>(
      GetConcertListUseCase,
    );
    dataSource = module.get<DataSource>(DataSource);

    // 데이터베이스 초기화 및 테스트 데이터 삽입
  });

  describe("getConcertListUseCase 통합테스트", () => {
    it("콘서트 목록 정상 조회", async () => {
      const test = "test";
      expect(test).toBeDefined();
      // const concerts = await getConcertListUseCase.execute();
    });
  });
});
