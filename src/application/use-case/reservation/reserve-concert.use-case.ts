import { Inject, Injectable } from "@nestjs/common";
import { ReservationService } from "@app/domain/service/reservation/reservation.service";
import { ConcertService } from "@app/domain/service/concert/concert.service";
import ConcertSeatStatus from "@app/domain/enum/concert-seat-status.enum";
import { DataSource } from "typeorm";
import { TicketEntity } from "@app/domain/entity/ticket.entity";

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
  ): Promise<TicketEntity[]> {
    // 판매 가능 여부 체크
    await this.concertService.checkSaleSeat(seatIds);

    return await this.dataSource
      .createEntityManager()
      .transaction(async (manager) => {
        // Pending 상태로 변경
        await this.concertService.changeStatus(
          seatIds,
          ConcertSeatStatus.PENDING,
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
  }
}
