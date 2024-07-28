import { BadRequestException, Inject, Injectable } from "@nestjs/common";

import {
  TicketRepository,
  TicketRepositorySymbol,
} from "@app/domain/interface/repository/ticket.repository";
import { EntityManager } from "typeorm";
import { TicketEntity } from "@app/domain/entity/ticket.entity";
import { UserEntity } from "@app/domain/entity/user.entity";
import { ConcertEntity } from "@app/domain/entity/concert.entity";
import { ConcertSeatEntity } from "@app/domain/entity/concert-seat.entity";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";
import TicketStatus from "@app/domain/enum/ticket-status.enum";

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
  ): Promise<TicketEntity[]> {
    // 티켓 여러개 만들기
    let ticketList = seatIds.map(
      (seatId) =>
        new TicketEntity({
          user: new UserEntity({ id: userId }),
          concert: new ConcertEntity({ id: concertId }),
          seat: new ConcertSeatEntity({ id: seatId }),
          schedule: new ConcertScheduleEntity({ id: concertScheduleId }),
        }),
    );

    ticketList = await this.ticketRepository.save(ticketList, _manager);

    return ticketList;
  }

  async getTicketList(
    userId: number,
    ticketIds: number[],
    _manager?: EntityManager,
  ): Promise<TicketEntity[]> {
    const ticketList =
      await this.ticketRepository.findByIdsAndUserIdWithPending(
        userId,
        ticketIds,
        _manager,
      );

    if (ticketList.length !== ticketIds.length) {
      throw new BadRequestException("잘못된 요청입니다.");
    }

    return ticketList;
  }

  async changeStatus(
    tickets: TicketEntity[],
    status: TicketStatus,
    _manager?: EntityManager,
  ): Promise<void> {
    tickets.forEach((ticket) => {
      ticket.status = status;
      this.ticketRepository.updateStatus(ticket, _manager);
    });
  }
}
