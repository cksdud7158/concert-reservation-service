import { Injectable } from "@nestjs/common";
import { EntityManager, In, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { WaitingQueueRepository } from "@app/domain/interface/repository/waiting-queue.repository";
import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";
import WaitingQueuesEntity from "@app/domain/entity/waiting-queues.entity";
import WaitingQueueStatus from "@app/infrastructure/enum/waiting-queue-status.enum";

@Injectable()
export class WaitingQueueRepositoryImpl implements WaitingQueueRepository {
  constructor(
    @InjectRepository(WaitingQueue)
    private readonly waitingQueue: Repository<WaitingQueue>,
  ) {}

  async insert(
    userId: number,
    status: WaitingQueueStatus,
    _manager?: EntityManager,
  ): Promise<void> {
    const manager = _manager ?? this.waitingQueue.manager;
    await manager.insert(WaitingQueue, {
      user_id: userId,
      status: status,
    });
  }

  async findByStatusNotExpired(
    _manager?: EntityManager,
  ): Promise<WaitingQueuesEntity> {
    const manager = _manager ?? this.waitingQueue.manager;
    const entity = await manager.findBy(WaitingQueue, {
      status: Not(WaitingQueueStatus.EXPIRED),
    });

    return new WaitingQueuesEntity(entity);
  }

  async findByIdAndStatus(
    userId: number,
    status: WaitingQueueStatus,
    _manager?: EntityManager,
  ): Promise<WaitingQueue[]> {
    const manager = _manager ?? this.waitingQueue.manager;
    const entity = await manager.findBy(WaitingQueue, {
      user_id: userId,
      status: status,
    });
    return entity;
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
}
