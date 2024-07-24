import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import ConcertScheduleStatus from "@app/domain/enum/concert-seat-status.enum";
import { DataSource } from "typeorm";
import { TicketEntity } from "@app/domain/entity/ticket.entity";
import { LockService } from "@app/domain/service/redis/redis.service";
import { delay } from "@app/common/util/util";

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
    let repeatTime = 0;

    while (true) {
      // 락 획득
      const hasLock = await this.lockService.acquireLock(key, key);

      // 락 획득을 못하면
      if (!hasLock) {
        // 재시도 10번 넘으면 잘가
        if (repeatTime > 10) {
          throw new BadRequestException("예약 불가");
        }
        repeatTime++;
        // 대기후 재시도
        await delay(2000);
        continue;
      }

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
          await this.concertService.changeSeatStatus(concertSeatList, manager);

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
}
