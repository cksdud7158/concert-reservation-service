import { Inject, Injectable } from "@nestjs/common";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import ConcertScheduleStatus from "@app/domain/enum/concert-seat-status.enum";
import { DataSource } from "typeorm";
import { TicketEntity } from "@app/domain/entity/ticket.entity";
import { LockService } from "@app/domain/service/redis/redis.service";

@Injectable()
export class ReserveConcertUseCase {
  constructor(
    @Inject() private readonly reservationService: ReservationService,
    @Inject() private readonly concertService: ConcertService,
    @Inject() private readonly lockService: LockService,
    private readonly dataSource: DataSource,
  ) {}

  async execute(
    userId: number,
    concertId: number,
    concertScheduleId: number,
    seatIds: number[],
  ): Promise<TicketEntity[]> {
    const key = `reserve-${concertId}-${concertScheduleId}-${seatIds}`;
    // 락 획득
    await this.lockService.acquireLock(key, key);

    const ticketList = await this.dataSource
      .createEntityManager()
      .transaction(async (manager) => {
        // 판매 가능 여부 체크
        const concertSeatList = await this.concertService.checkSaleSeat(
          seatIds,
          manager,
        );

        // pending 으로 상태 변경
        concertSeatList.forEach((seat) => {
          seat.status = ConcertScheduleStatus.PENDING;
        });

        // Pending 상태로 변경 업데이트
        await this.concertService.changeSeatStatus(
          concertSeatList,
          ConcertScheduleStatus.PENDING,
          manager,
        );

        // 티켓 발행
        const ticketList = await this.reservationService.makeTickets(
          userId,
          concertId,
          concertScheduleId,
          seatIds,
          manager,
        );

        return ticketList;
      });

    await this.lockService.releaseLock(key);

    return ticketList;
  }
}
