import { ApiProperty } from "@nestjs/swagger";
import TicketStatus from "@app/domain/enum/ticket-status.enum";
import ConcertSeatStatus from "@app/domain/enum/concert-seat-status.enum";
import { ConcertEntity } from "@app/domain/entity/concert.entity";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";
import { TicketEntity } from "@app/domain/entity/ticket.entity";
import { ConcertSeatEntity } from "@app/domain/entity/concert-seat.entity";

const ticketsExample = [
  {
    id: 1,
    status: TicketStatus.PENDING,
    concert: {
      id: 1,
      creat_at: new Date(),
      update_at: new Date(),
      name: "프로미스 나인",
    },
    schedule: {
      id: 1,
      creat_at: new Date(),
      update_at: new Date(),
      date: new Date(),
    },
    seat: {
      id: 1,
      creat_at: new Date(),
      update_at: new Date(),
      status: ConcertSeatStatus.PENDING,
      price: 10000,
      seat_number: 1,
    },
  },
];

export class ReserveConcertResponse {
  @ApiProperty({ example: 10, minimum: 0 })
  total: number;

  @ApiProperty({ example: ticketsExample })
  tickets: {
    id: number;
    status: TicketStatus;
    concert: ConcertEntity;
    schedule: ConcertScheduleEntity;
    seat: ConcertSeatEntity;
  }[];

  static toResponse(ticketList: TicketEntity[]): ReserveConcertResponse {
    return {
      total: ticketList.length,
      tickets: ticketList.map((ticket) => {
        return {
          id: ticket.id,
          status: ticket.status,
          concert: ticket.concert,
          schedule: ticket.schedule,
          seat: ticket.seat,
        };
      }),
    };
  }
}
