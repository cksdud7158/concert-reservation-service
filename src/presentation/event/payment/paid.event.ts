import { PaymentEntity } from "@app/domain/entity/payment/payment.entity";
import { MessageType } from "@app/domain/type/message/producer.type";

export class PaidEvent {
  constructor(public readonly payment: PaymentEntity) {}

  // 순차 처리 중요 X -> key 사용 X
  get message(): MessageType {
    return {
      value: JSON.stringify(this.payment),
    };
  }
}
