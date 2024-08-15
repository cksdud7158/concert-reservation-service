import { PaidEvent } from "@app/infrastructure/entity/paid-event.entity";
import { PaidEventEntity } from "@app/domain/entity/payment/paid-event.entity";

class PaidEventMapper {
  static toDomain(paidEvent: PaidEvent): PaidEventEntity {
    return new PaidEventEntity({
      id: paidEvent.id,
      creat_at: paidEvent.creat_at,
      update_at: paidEvent.update_at,
      status: paidEvent.status,
      payment_id: paidEvent.payment_id,
      message: JSON.parse(paidEvent.message),
    });
  }

  static toEntity(paidEvent: PaidEventEntity): PaidEvent {
    const event = new PaidEvent();
    event.id = paidEvent.id;
    event.creat_at = paidEvent.creat_at;
    event.update_at = paidEvent.update_at;
    event.status = paidEvent.status;
    event.payment_id = paidEvent.payment_id;
    event.message = JSON.stringify(paidEvent.message);

    return event;
  }
}

export default PaidEventMapper;
