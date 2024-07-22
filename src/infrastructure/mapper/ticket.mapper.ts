import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { TicketEntity } from "@app/domain/entity/ticket.entity";
import UserMapper from "@app/infrastructure/mapper/user.mapper";

class TicketMapper {
  static toDomain(ticket: Ticket): TicketEntity {
    return new TicketEntity({
      id: ticket.id,
      creat_at: ticket.creat_at,
      update_at: ticket.update_at,
      status: ticket.status,
      user: UserMapper.toDomain(ticket.user),
    });
  }
}

export default TicketMapper;
