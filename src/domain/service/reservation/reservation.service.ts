import { Inject, Injectable } from "@nestjs/common";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import {
  TicketRepository,
  TicketRepositorySymbol,
} from "@app/domain/interface/repository/ticket.repository";

@Injectable()
export class ReservationService {
  constructor(
    @Inject(TicketRepositorySymbol)
    private readonly ticketRepository: TicketRepository,
  ) {}

  async makeTickets(
    userId: number,
    concertId: number,
    concertScheduleId: number,
    seatIds: number[],
  ): Promise<Ticket[]> {
    // 티켓 여러개 만들기
    const ticketIds = await this.ticketRepository.insert(
      userId,
      concertId,
      concertScheduleId,
      seatIds,
    );

    // 해당 seat pending 처리

    // 티켓 리스트 조회
    const ticketList = await this.ticketRepository.findByIds(ticketIds);

    return ticketList;
  }
}
