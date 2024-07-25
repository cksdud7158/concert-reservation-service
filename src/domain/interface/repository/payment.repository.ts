import { EntityManager } from "typeorm";
import { PaymentEntity } from "@app/domain/entity/payment.entity";

export const PaymentRepositorySymbol = Symbol.for("PaymentRepository");

export interface PaymentRepository {
  insert(
    userId: number,
    ticketIds: number[],
    price: number,
    _manager?: EntityManager,
  ): Promise<number>;

  findOneById(
    paymentId: number,
    _manager?: EntityManager,
  ): Promise<PaymentEntity>;
}
