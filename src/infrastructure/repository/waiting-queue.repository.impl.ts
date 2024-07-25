import { Injectable } from "@nestjs/common";
import { EntityManager, In, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { WaitingQueueRepository } from "@app/domain/interface/repository/waiting-queue.repository";
import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";
import WaitingQueuesEntity from "@app/domain/entity/waiting-queues.entity";
import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import WaitingQueueEntity from "@app/domain/entity/waiting-queue.entity";
import WaitingQueueMapper from "@app/infrastructure/mapper/waiting-queue.mapper";

@Injectable()
export class WaitingQueueRepositoryImpl implements WaitingQueueRepository {
  constructor(
    @InjectRepository(WaitingQueue)
    private readonly waitingQueue: Repository<WaitingQueue>,
  ) {}

  async save(
    waitingQueue: WaitingQueue,
    _manager?: EntityManager,
  ): Promise<WaitingQueueEntity> {
    const manager = _manager ?? this.waitingQueue.manager;
    const entity = await manager.save(WaitingQueue, waitingQueue);

    return WaitingQueueMapper.toDomain(entity);
  }

  async findByNotExpiredStatus(
    _manager?: EntityManager,
  ): Promise<WaitingQueuesEntity> {
    const manager = _manager ?? this.waitingQueue.manager;
    const entity = await manager.findBy(WaitingQueue, {
      status: Not(WaitingQueueStatus.EXPIRED),
    });

    return new WaitingQueuesEntity(
      entity.map((val) => WaitingQueueMapper.toDomain(val)),
    );
  }

  async updateStatusToExpired(
    idList: number[],
    _manager?: EntityManager,
  ): Promise<void> {
    const manager = _manager ?? this.waitingQueue.manager;
    await manager
      .createQueryBuilder()
      .update(WaitingQueue)
      .set({ status: WaitingQueueStatus.EXPIRED })
      .where({ id: In(idList) })
      .execute();
  }

  async findOneById(
    id: number,
    _manager?: EntityManager,
  ): Promise<WaitingQueueEntity> {
    const manager = _manager ?? this.waitingQueue.manager;
    const entity = await manager.findOneBy(WaitingQueue, { id: id });

    return WaitingQueueMapper.toDomain(entity);
  }

  async updateEntities(
    waitingQueues: WaitingQueuesEntity,
    _manager?: EntityManager,
  ) {
    const manager = _manager ?? this.waitingQueue.manager;
    waitingQueues.waitingQueueList.forEach((waitingQueue) => {
      manager
        .createQueryBuilder()
        .update(WaitingQueue)
        .set({
          orderNum: waitingQueue.orderNum,
          status: waitingQueue.status,
        })
        .where("id = :id", { id: waitingQueue.id })
        .execute();
    });
  }

  async updateStatusByUserId(
    userId: number,
    status: WaitingQueueStatus,
    _manager?: EntityManager,
  ): Promise<void> {
    const manager = _manager ?? this.waitingQueue.manager;
    await manager
      .createQueryBuilder()
      .update(WaitingQueue)
      .set({
        status: status,
      })
      .where("user_id = :userId", { userId: userId })
      .execute();
  }
}
