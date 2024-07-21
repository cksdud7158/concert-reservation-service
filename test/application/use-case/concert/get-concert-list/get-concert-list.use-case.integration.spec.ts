import { Test, TestingModule } from "@nestjs/testing";
import { GetConcertListUseCase } from "@app/application/use-case/concert/get-concert-list/get-concert-list.use-case";
import { INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { mockAppModule } from "../../../../mock/App.module";

describe("GetConcertListUseCase", () => {
  let app: INestApplication;
  let getConcertListUseCase: GetConcertListUseCase;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...mockAppModule],
    }).compile();

    app = module.createNestApplication();
    getConcertListUseCase = module.get<GetConcertListUseCase>(
      GetConcertListUseCase,
    );
    dataSource = module.get<DataSource>(DataSource);

    await app.init();

    // 데이터베이스 초기화 및 테스트 데이터 삽입
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.save(Concert, {
        name: "Test Concert",
        schedules: [],
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  });

  afterEach(async () => {
    // 데이터 정리
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.clear(ConcertSeat);
      await queryRunner.manager.clear(ConcertSchedule);
      await queryRunner.manager.clear(Concert);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    await app.close();
  });

  describe("getConcertListUseCase 통합테스트", () => {
    it("콘서트 목록 정상 조회", async () => {
      const concerts = await getConcertListUseCase.execute();

      expect(concerts.length).toBeGreaterThan(0);
      expect(concerts[0].name).toBe("Test Concert");
    });
  });
});
