import { TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { User } from "@app/infrastructure/entity/user.entity";
import { ReserveConcertUseCase } from "@app/application/use-case/reservation/reserve-concert.use-case";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import ConcertScheduleStatus from "@app/domain/enum/concert-seat-status.enum";
import TicketStatus from "@app/domain/enum/ticket-status.enum";

describe("ReserveConcertUseCase", () => {
  let reserveConcertUseCase: ReserveConcertUseCase;
  let dataSource: DataSource;
  let user: User;
  let concert: Concert;
  let schedule: ConcertSchedule;
  let seat1: ConcertSeat;
  let seat2: ConcertSeat;
  let userList: User[];

  beforeEach(async () => {
    const module: TestingModule = global.mockModule;

    reserveConcertUseCase = module.get<ReserveConcertUseCase>(
      ReserveConcertUseCase,
    );
    dataSource = module.get<DataSource>(DataSource);

    // 데이터베이스 초기화 및 테스트 데이터 삽입
    try {
      await dataSource.createEntityManager().transaction(async (manager) => {
        user = await manager.save(User, { point: 2000 });

        userList = await manager.save(
          User,
          Array.from({ length: 100 }).map((_) => ({})),
        );

        concert = await manager.save(Concert, {
          name: "Test Concert",
        });

        schedule = await manager.save(ConcertSchedule, {
          date: new Date(),
          concert: concert,
        });

        seat1 = await manager.save(ConcertSeat, {
          schedule: schedule,
          status: ConcertScheduleStatus.SALE,
          price: 1000,
          seat_number: 1,
        });
        seat2 = await manager.save(ConcertSeat, {
          schedule: schedule,
          status: ConcertScheduleStatus.SALE,
          price: 1000,
          seat_number: 2,
        });
      });
    } catch (e) {
      console.log("error::", e);
    }
  });

  describe("ReserveConcertUseCase 통합테스트", () => {
    it("정상 예약", async () => {
      // given

      // when

      const res = await reserveConcertUseCase.execute(
        user.id,
        concert.id,
        schedule.id,
        [seat1.id, seat2.id],
      );

      // then
      expect(res).toHaveLength(2);
      expect(res[0].status).toBe(TicketStatus.PENDING);
    });

    it("ReserveConcertUseCase 동시성 테스트", async () => {
      // given

      const requests = userList.map((user) => {
        return reserveConcertUseCase.execute(user.id, concert.id, schedule.id, [
          seat1.id,
          seat2.id,
        ]);
      });

      // when
      const results = await Promise.allSettled(requests);

      // then
      expect(results.filter((res) => res.status === "fulfilled")).toHaveLength(
        1,
      );
      expect(results.filter((res) => res.status === "rejected")).toHaveLength(
        99,
      );
    }, 10000);
  });
});
