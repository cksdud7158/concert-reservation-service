import { Test, TestingModule } from "@nestjs/testing";
import { GetSeatListUseCase } from "@app/application/use-case/concert/get-seat-list/get-seat-list.use-case";
import { INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import ConcertScheduleStatus from "@app/infrastructure/enum/concert-seat-status.enum";
import { mockAppModule } from "../../../../mock/App.module";

describe("GetSeatListUseCase", () => {
  let app: INestApplication;
  let getSeatListUseCase: GetSeatListUseCase;
  let dataSource: DataSource;
  let concert: Concert;
  let schedule: ConcertSchedule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...mockAppModule],
    }).compile();

    app = module.createNestApplication();
    getSeatListUseCase = module.get<GetSeatListUseCase>(GetSeatListUseCase);
    dataSource = module.get<DataSource>(DataSource);

    await app.init();

    // Initialize database and insert test data
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      concert = await queryRunner.manager.save(Concert, {
        name: "Test Concert",
      });

      schedule = await queryRunner.manager.save(ConcertSchedule, {
        date: new Date(),
        concert: concert,
      });

      await queryRunner.manager.save(ConcertSeat, {
        schedule: schedule,
        status: ConcertScheduleStatus.SALE,
        price: 1000,
        seat_number: 1,
      });

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  });

  afterEach(async () => {
    // Clear data
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

  describe("getSeatListUseCase Integration Test", () => {
    it("콘서트 좌석 조회 성공", async () => {
      const seats = await getSeatListUseCase.execute(schedule.id);
      expect(seats.length).toBeGreaterThan(0);
    });
  });
});
