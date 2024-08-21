import { EntityManager } from "typeorm";
import { PaidEventEntity } from "@app/domain/entity/payment/paid-event.entity";
import PaidEventStatusEnum from "@app/domain/enum/entity/paid-event-status.enum";

export const PaidEventRepositorySymbol = Symbol.for("PaidEventRepository");

export interface PaidEventRepository {
  insert(event: PaidEventEntity, _manager?: EntityManager): Promise<void>;
  updateStatusByPaymentId(
    paymentId: number,
    status: PaidEventStatusEnum,
    _manager?: EntityManager,
  ): Promise<void>;

  findByNotSuccessStatusWithAfter5min(): Promise<PaidEventEntity[]>;
}
