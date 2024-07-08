import { Injectable } from "@nestjs/common";
import { WaitingQueueRepository } from "../../domain/interface/repository/waiting-queue.repository";
import { WaitingQueue } from "../entity/waiting-queue.entity";
import WaitingQueueStatus from "../enum/waiting-queue-status.enum";
import { EntityManager, In, Not, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import WaitingQueuesEntity from "../../domain/entity/waiting-queues.entity";

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
