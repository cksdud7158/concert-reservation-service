import PaymentStatus from "@app/domain/enum/entity/payment-status.enum";
import { TicketEntity } from "@app/domain/entity/ticket/ticket.entity";
import { UserEntity } from "@app/domain/entity/user/user.entity";

export class PaymentEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  price: number;
  status: PaymentStatus;
  tickets: TicketEntity[];
  user: UserEntity;
  constructor(
    args: Partial<{
      id: number;
      creat_at: Date;
      update_at: Date;
      price: number;
      status: PaymentStatus;
      tickets: TicketEntity[];
      user: UserEntity;
    }>,
  ) {
    Object.assign(this, args);
  }
}
