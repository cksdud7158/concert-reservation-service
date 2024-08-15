import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, InsertResult, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PaymentRepository } from "@app/domain/interface/repository/payment.repository";
import { Payment } from "@app/infrastructure/entity/payment.entity";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { PaymentEntity } from "@app/domain/entity/payment/payment.entity";
import PaymentMapper from "@app/infrastructure/mapper/payment.mapper";

@Injectable()
export class PaymentRepositoryImpl implements PaymentRepository {
  constructor(
    @InjectRepository(Payment)
    private readonly payment: Repository<Payment>,
  ) {}

  async insert(
    userId: number,
    ticketIds: number[],
    price: number,
    _manager?: EntityManager,
  ): Promise<number> {
    const payment = {
      user: {
        id: userId,
      },
      tickets: ticketIds.map((id) => ({ id }) as Ticket),
      price: price,
    };

    const manager = _manager ?? this.payment.manager;
    const res: InsertResult = await manager
      .createQueryBuilder()
      .insert()
      .into(Payment)
      .values(payment)
      .execute();

    return res.identifiers[0].id;
  }

  async findOneById(
    paymentId: number,
    _manager?: EntityManager,
  ): Promise<PaymentEntity> {
    const manager = _manager ?? this.payment.manager;
    const entity = await manager.findOne(Payment, {
      relations: {
        user: true,
      },
      where: {
        id: paymentId,
      },
    });

    return PaymentMapper.toDomain(entity);
  }
}
