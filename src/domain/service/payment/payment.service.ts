import { Inject, Injectable } from "@nestjs/common";
import {
  PaymentRepository,
  PaymentRepositorySymbol,
} from "@app/domain/interface/repository/payment.repository";
import { EntityManager } from "typeorm";
import { PaymentEntity } from "@app/domain/entity/payment/payment.entity";

@Injectable()
export class PaymentService {
  constructor(
    @Inject(PaymentRepositorySymbol)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  //결제하기
  async pay(
    userId: number,
    ticketIds: number[],
    price: number,
    _manager?: EntityManager,
  ): Promise<PaymentEntity> {
    const paymentId = await this.paymentRepository.insert(
      userId,
      ticketIds,
      price,
      _manager,
    );

    return this.paymentRepository.findOneById(paymentId, _manager);
  }
}
