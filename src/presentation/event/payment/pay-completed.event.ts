import { PaymentEntity } from "@app/domain/entity/payment.entity";

export class PayCompletedEvent {
  constructor(public readonly payment: PaymentEntity) {}
}
