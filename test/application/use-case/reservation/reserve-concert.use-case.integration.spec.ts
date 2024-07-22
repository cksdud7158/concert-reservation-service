import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, INestApplication } from "@nestjs/common";
import { AppModule } from "@app/app.module";
import { DataSource } from "typeorm";
import { User } from "@app/infrastructure/entity/user.entity";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import ConcertSeatStatus from "@app/domain/enum/concert-seat-status.enum";
import { ReserveConcertUseCase } from "@app/application/use-case/reservation/reserve-concert/reserve-concert.use-case";

describe("ReserveConcertUseCase", () => {
  let app: INestApplication;
  let reserveConcertUseCase: ReserveConcertUseCase;
  let dataSource: DataSource;
  let concertService: ConcertService;
  let user: User;
  let concert: Concert;
  let schedule: ConcertSchedule;
  let seat: ConcertSeat;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    reserveConcertUseCase = module.get<ReserveConcertUseCase>(
      ReserveConcertUseCase,
    );
    dataSource = module.get<DataSource>(DataSource);
    concertService = module.get<ConcertService>(ConcertService);

    await app.init();

    // Initialize database and insert test data
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      user = await queryRunner.manager.save(User, {
        point: 0,
      });

      concert = await queryRunner.manager.save(Concert, {
        name: "Test Concert",
        creat_at: new Date(),
        update_at: new Date(),
      });

      schedule = await queryRunner.manager.save(ConcertSchedule, {
        date: new Date(),
        creat_at: new Date(),
        update_at: new Date(),
        concert: concert,
      });

      seat = await queryRunner.manager.save(ConcertSeat, {
        creat_at: new Date(),
        update_at: new Date(),
        schedule: schedule,
        status: ConcertSeatStatus.SALE,
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
      await queryRunner.manager.clear(Ticket);
      await queryRunner.manager.clear(ConcertSeat);
      await queryRunner.manager.clear(ConcertSchedule);
      await queryRunner.manager.clear(Concert);
      await queryRunner.manager.clear(User);
      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }

    await app.close();
  });

  describe("ReserveConcertUseCase Integration Test", () => {
    it("예약 성공", async () => {
      const userId = user.id;
      const concertId = concert.id;
      const concertScheduleId = schedule.id;
      const seatIds = [seat.id];

      const tickets = await reserveConcertUseCase.execute(
        userId,
        concertId,
        concertScheduleId,
        seatIds,
      );

      expect(tickets.length).toBeGreaterThan(0);
      expect(tickets[0].seat.id).toBe(seat.id);
      expect(tickets[0].user.id).toBe(user.id);
    });

    it("좌석 이용 불가로 예약 실패", async () => {
      const userId = user.id;
      const concertId = concert.id;
      const concertScheduleId = schedule.id;
      const seatIds = [seat.id];

      // Simulate seat not available for sale by mocking concertService.checkSaleSeat
      jest.spyOn(concertService, "checkSaleSeat").mockImplementation(() => {
        throw new BadRequestException("Seat not available for sale.");
      });

      const res = reserveConcertUseCase.execute(
        userId,
        concertId,
        concertScheduleId,
        seatIds,
      );

      await expect(res).rejects.toThrow(
        new BadRequestException("Seat not available for sale."),
      );
    });

    it("좌석이 Pending 상태여서 예약 실패", async () => {
      const userId = user.id;
      const concertId = concert.id;
      const concertScheduleId = schedule.id;
      const seatIds = [seat.id];

      // Simulate seat is already pending
      await concertService.changeStatus(seatIds, ConcertSeatStatus.PENDING);

      const res = reserveConcertUseCase.execute(
        userId,
        concertId,
        concertScheduleId,
        seatIds,
      );

      await expect(res).rejects.toThrow(
        new BadRequestException("이미 판매된 좌석입니다."),
      );
    });
  });
});
