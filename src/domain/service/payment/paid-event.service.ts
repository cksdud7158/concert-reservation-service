import { Inject, Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import {
  PaidEventRepository,
  PaidEventRepositorySymbol,
} from "@app/domain/interface/repository/paid-event.repository";
import { PaidEventEntity } from "@app/domain/entity/payment/paid-event.entity";
import { PaidEvent } from "@app/presentation/event/payment/paid.event";
import { PaymentEntity } from "@app/domain/entity/payment/payment.entity";
import PaidEventStatusEnum from "@app/domain/enum/entity/paid-event-status.enum";

@Injectable()
export class PaidEventService {
  constructor(
    @Inject(PaidEventRepositorySymbol)
    private readonly paidEventRepository: PaidEventRepository,
  ) {}

  // outbox 내역 저장
  async save(event: PaidEvent, manager?: EntityManager): Promise<void> {
    const paidEvent = new PaidEventEntity({
      payment_id: event.payment.id,
      message: event.message,
    });
    await this.paidEventRepository.insert(paidEvent, manager);
  }

  // outbox 내역 저장
  async updateStatus(
    payment: PaymentEntity,
    status: PaidEventStatusEnum,
  ): Promise<void> {
    const event = new PaidEventEntity({
      payment_id: payment.id,
      status: status,
    });

    await this.paidEventRepository.updateStatusByPaymentId(event);
  }
}
