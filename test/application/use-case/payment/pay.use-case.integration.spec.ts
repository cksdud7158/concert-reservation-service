import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, INestApplication } from "@nestjs/common";
import { DataSource } from "typeorm";
import { User } from "@app/infrastructure/entity/user.entity";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { Payment } from "@app/infrastructure/entity/payment.entity";
import { UserService } from "@app/domain/service/user/user.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import ConcertScheduleStatus from "@app/domain/enum/concert-seat-status.enum";
import { mockAppModule } from "../../../mock/App.module";
import { PayUseCase } from "@app/application/use-case/payment/pay.use-case";

describe("PayUseCase", () => {
  let app: INestApplication;
  let payUseCase: PayUseCase;
  let dataSource: DataSource;
  let userService: UserService;
  let concertService: ConcertService;
  let user: User;
  let concert: Concert;
  let schedule: ConcertSchedule;
  let seat: ConcertSeat;
  let ticket: Ticket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...mockAppModule],
    }).compile();

    app = module.createNestApplication();
    payUseCase = module.get<PayUseCase>(PayUseCase);
    dataSource = module.get<DataSource>(DataSource);

    userService = module.get<UserService>(UserService);
    concertService = module.get<ConcertService>(ConcertService);

    await app.init();

    // 데이터베이스 초기화 및 테스트 데이터 삽입
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      user = await queryRunner.manager.save(User, {
        name: "Test User",
        point: 5000,
      });

      concert = await queryRunner.manager.save(Concert, {
        name: "Test Concert",
      });

      schedule = await queryRunner.manager.save(ConcertSchedule, {
        date: new Date(),
        concert: concert,
      });

      seat = await queryRunner.manager.save(ConcertSeat, {
        schedule: schedule,
        status: ConcertScheduleStatus.SALE,
        price: 1000,
        seat_number: 1,
      });

      ticket = await queryRunner.manager.save(Ticket, {
        user,
        seat,
        concert,
        schedule,
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
      await queryRunner.manager.clear(Payment);
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

  describe("PayUseCase Integration Test", () => {
    it("정상 결제", async () => {
      const userId = user.id;
      const ticketIds = [ticket.id];

      const payment = await payUseCase.execute(userId, ticketIds);

      expect(payment).toBeDefined();
    });

    it("잔액 부족으로 결제 실패", async () => {
      const userId = user.id;
      const ticketIds = [ticket.id];

      // Set user's points to less than the ticket price
      await userService.usePoint(userId, user.point - 500);

      const res = payUseCase.execute(userId, ticketIds);

      await expect(res).rejects.toThrow(
        new BadRequestException("잔액이 부족합니다."),
      );
    });

    it("티켓 만료로 결제 실패", async () => {
      const userId = user.id;
      const ticketIds = [ticket.id];

      // Simulate ticket expiration by mocking concertService.checkExpiredTime
      jest.spyOn(concertService, "checkExpiredTime").mockImplementation(() => {
        throw new BadRequestException("Ticket expired.");
      });

      const res = payUseCase.execute(userId, ticketIds);

      await expect(res).rejects.toThrow(
        new BadRequestException("Ticket expired."),
      );
    });
  });
});
