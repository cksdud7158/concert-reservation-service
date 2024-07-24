import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { TicketEntity } from "@app/domain/entity/ticket.entity";
import UserMapper from "@app/infrastructure/mapper/user.mapper";
import ConcertSeatMapper from "@app/infrastructure/mapper/concert-seat.mapper";
import ConcertScheduleMapper from "@app/infrastructure/mapper/concert-schedule.mapper";
import ConcertMapper from "@app/infrastructure/mapper/concert.mapper";

class TicketMapper {
  static toDomain(ticket: Ticket): TicketEntity {
    return new TicketEntity({
      id: ticket.id,
      creat_at: ticket.creat_at,
      update_at: ticket.update_at,
      status: ticket.status,
      seat: ticket.seat ? ConcertSeatMapper.toDomain(ticket.seat) : null,
      schedule: ticket.schedule
        ? ConcertScheduleMapper.toDomain(ticket.schedule)
        : null,
      concert: ticket.concert ? ConcertMapper.toDomain(ticket.concert) : null,
      user: ticket.user ? UserMapper.toDomain(ticket.user) : null,
      version: ticket.version,
    });
  }
}

export default TicketMapper;
