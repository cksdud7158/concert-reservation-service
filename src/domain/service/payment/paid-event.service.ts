import { Inject, Injectable } from "@nestjs/common";
import { EntityManager } from "typeorm";
import {
  PaidEventRepository,
  PaidEventRepositorySymbol,
} from "@app/domain/interface/repository/paid-event.repository";
import { PaidEventEntity } from "@app/domain/entity/payment/paid-event.entity";
import { PaidEvent } from "@app/presentation/event/payment/paid.event";

@Injectable()
export class PaidEventService {
  constructor(
    @Inject(PaidEventRepositorySymbol)
    private readonly paidEventRepository: PaidEventRepository,
  ) {}

  // outbox 내역 저장
  async save(event: PaidEvent, manager?: EntityManager): Promise<void> {
    const paidEvent = new PaidEventEntity({
      message: event.message,
    });
    await this.paidEventRepository.insert(paidEvent, manager);
  }
}
