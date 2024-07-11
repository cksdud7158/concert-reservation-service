import { Inject, Injectable } from "@nestjs/common";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import ConcertSeatStatus from "@app/infrastructure/enum/concert-seat-status.enum";
import { DataSource } from "typeorm";

@Injectable()
export class ReserveConcertUseCase {
  constructor(
    @Inject() private readonly reservationService: ReservationService,
    @Inject() private readonly concertService: ConcertService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    userId: number,
    concertId: number,
    concertScheduleId: number,
    seatIds: number[],
  ): Promise<Partial<Ticket>[]> {
    // 판매 가능 여부 체크
    await this.concertService.checkSaleSeat(seatIds);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const manager = queryRunner.manager;

    try {
      // Pending 상태로 변경
      await this.concertService.changeStatus(
        seatIds,
        ConcertSeatStatus.PENDING,
        manager,
      );

      // 티켓 발행
      return await this.reservationService.makeTickets(
        userId,
        concertId,
        concertScheduleId,
        seatIds,
        manager,
      );
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
