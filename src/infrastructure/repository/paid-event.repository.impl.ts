import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PaidEventRepository } from "@app/domain/interface/repository/paid-event.repository";
import { PaidEvent } from "@app/infrastructure/entity/paid-event.entity";
import { PaidEventEntity } from "@app/domain/entity/payment/paid-event.entity";

@Injectable()
export class PaidEventRepositoryImpl implements PaidEventRepository {
  constructor(
    @InjectRepository(PaidEvent)
    private readonly paidEvent: Repository<PaidEvent>,
  ) {}

  async insert(
    event: PaidEventEntity,
    _manager?: EntityManager,
  ): Promise<void> {
    const manager = _manager ?? this.paidEvent.manager;
    await manager
      .createQueryBuilder()
      .insert()
      .into(PaidEvent)
      .values(event)
      .execute();
  }

  async updateStatusByPaymentId(
    event: PaidEventEntity,
    _manager?: EntityManager,
  ): Promise<void> {
    const manager = _manager ?? this.paidEvent.manager;
    await manager
      .createQueryBuilder()
      .update(PaidEvent)
      .set(event)
      .where("id = :id", { id: event.id })
      .execute();
  }
}
