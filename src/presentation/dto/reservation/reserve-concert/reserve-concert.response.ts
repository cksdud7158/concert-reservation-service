import { ApiProperty } from "@nestjs/swagger";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import TicketStatus from "@app/infrastructure/enum/ticket-status.enum";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";

const schedulesExample = [
  {
    id: 1,
    date: 12321345,
    isSoldOut: false,
  },
];

export class ReserveConcertResponse {
  @ApiProperty({ example: 10, minimum: 0 })
  total: number;

  @ApiProperty({ example: schedulesExample })
  tickets: {
    id: number;
    status: TicketStatus;
    concert: Partial<Concert>;
    schedule: Partial<ConcertSchedule>;
    seat: Partial<ConcertSeat>;
  }[];

  static toResponse(ticketList: Partial<Ticket>[]): ReserveConcertResponse {
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
