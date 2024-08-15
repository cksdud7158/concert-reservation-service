import PaidEventStatus from "@app/domain/enum/entity/paid-event-status.enum";
import { MessageType } from "@app/domain/type/message/producer.type";

export class PaidEventEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  payment_id: number;
  status: PaidEventStatus;
  message: MessageType;

  constructor(
    args: Partial<{
      id: number;
      creat_at: Date;
      update_at: Date;
      payment_id: number;
      status: PaidEventStatus;
      message: MessageType;
    }>,
  ) {
    Object.assign(this, args);
  }
}
