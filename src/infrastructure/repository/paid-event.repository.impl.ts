import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { PaidEventRepository } from "@app/domain/interface/repository/paid-event.repository";
import { PaidEvent } from "@app/infrastructure/entity/paid-event.entity";
import { PaidEventEntity } from "@app/domain/entity/payment/paid-event.entity";
import PaidEventStatusEnum from "@app/domain/enum/entity/paid-event-status.enum";
import PaidEventMapper from "@app/infrastructure/mapper/paid-event.mapper";

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
      .values(PaidEventMapper.toEntity(event))
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
      .set({
        status: event.status,
      })
      .where("payment_id = :id", { id: event.payment_id })
      .execute();
  }

  async findByNotSuccessStatusWithAfter5min(): Promise<PaidEventEntity[]> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const entities = await this.paidEvent.manager
      .createQueryBuilder()
      .select()
      .from(PaidEvent, "pe")
      .where("pe.status != :status", {
        status: PaidEventStatusEnum.SEND_SUCCESS,
      })
      .andWhere("update_at < :date", { date: fiveMinutesAgo.toISOString() })
      .execute();

    if (!entities?.length) return;

    return entities.map((entity) => PaidEventMapper.toDomain(entity));
  }
}
