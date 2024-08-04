import { Test, TestingModule } from "@nestjs/testing";
import "../../../mock/config/jest-setup";
import { INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { mockAppModule } from "../../../mock/App.module";
import { GetScheduleListUseCase } from "@app/application/use-case/concert/get-schedule-list.use-case";

describe("GetScheduleListUseCase", () => {
  let app: INestApplication;
  let getScheduleListUseCase: GetScheduleListUseCase;
  let dataSource: DataSource;
  let concert: Concert;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...mockAppModule],
    }).compile();

    app = module.createNestApplication();
    getScheduleListUseCase = module.get<GetScheduleListUseCase>(
      GetScheduleListUseCase,
    );
    dataSource = module.get<DataSource>(DataSource);

    await app.init();

    // 데이터베이스 초기화 및 테스트 데이터 삽입
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      concert = await queryRunner.manager.save(Concert, {
        name: "Test Concert",
        creat_at: new Date(),
        update_at: new Date(),
        schedules: [],
      });

      await queryRunner.manager.save(ConcertSchedule, {
        date: new Date(),
        creat_at: new Date(),
        update_at: new Date(),
        concert: concert,
        seats: [],
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

  describe("getScheduleListUseCase 통합테스트", () => {
    it("스케줄 목록 정상 조회", async () => {
      const schedules = await getScheduleListUseCase.execute(concert.id);

      expect(schedules.length).toBeGreaterThan(0);
    });
  });
});
