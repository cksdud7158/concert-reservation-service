import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import {
  TicketRepository,
  TicketRepositorySymbol,
} from "@app/domain/interface/repository/ticket.repository";
import { EntityManager } from "typeorm";

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
    _manager?: EntityManager,
  ): Promise<Ticket[]> {
    // 티켓 여러개 만들기
    const ticketIds = await this.ticketRepository.insert(
      userId,
      concertId,
      concertScheduleId,
      seatIds,
      _manager,
    );

    // 해당 seat pending 처리

    // 티켓 리스트 조회
    const ticketList = await this.ticketRepository.findByIds(
      ticketIds,
      _manager,
    );

    return ticketList;
  }

  async getTicketList(
    userId: number,
    ticketIds: number[],
  ): Promise<Partial<Ticket>[]> {
    const ticketList = await this.ticketRepository.findByIdsAndUserId(
      userId,
      ticketIds,
    );

    if (ticketList.length !== ticketIds.length) {
      throw new BadRequestException("잘못된 요청입니다.");
    }

    return ticketList;
  }
}
