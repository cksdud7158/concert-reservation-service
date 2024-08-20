import { EntityManager } from "typeorm";
import { PaidEventEntity } from "@app/domain/entity/payment/paid-event.entity";

export const PaidEventRepositorySymbol = Symbol.for("PaidEventRepository");

export interface PaidEventRepository {
  insert(event: PaidEventEntity, _manager?: EntityManager): Promise<void>;
  updateStatusByPaymentId(
    event: PaidEventEntity,
    _manager?: EntityManager,
  ): Promise<void>;

  findByNotSuccessStatusWithAfter5min(): Promise<PaidEventEntity[]>;
}
