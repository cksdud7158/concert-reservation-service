import { Payment } from "@app/infrastructure/entity/payment.entity";
import { PaymentEntity } from "@app/domain/entity/payment.entity";
import TicketMapper from "@app/infrastructure/mapper/ticket.mapper";
import UserMapper from "@app/infrastructure/mapper/user.mapper";

class PaymentMapper {
  static toDomain(payment: Payment): PaymentEntity {
    return new PaymentEntity({
      id: payment.id,
      creat_at: payment.creat_at,
      update_at: payment.update_at,
      price: payment.price,
      status: payment.status,
      tickets: payment.tickets.map((ticket) => TicketMapper.toDomain(ticket)),
      user: UserMapper.toDomain(payment.user),
    });
  }
}

export default PaymentMapper;
