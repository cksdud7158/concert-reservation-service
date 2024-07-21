import WaitingQueuesEntity from "@app/domain/entity/waiting-queues.entity";
import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";
import WaitingQueueStatus from "@app/infrastructure/enum/waiting-queue-status.enum";
import { EntityManager } from "typeorm";

export const WaitingQueueRepositorySymbol = Symbol.for(
  "WaitingQueueRepository",
);

export interface WaitingQueueRepository {
  save(
    waitingQueue: WaitingQueue,
    _manager?: EntityManager,
  ): Promise<WaitingQueue>;

  findByNotExpiredStatus(
    _manager?: EntityManager,
  ): Promise<WaitingQueuesEntity>;

  updateStatusToExpired(
    idList: number[],
    _manager?: EntityManager,
  ): Promise<void>;

  findOneById(id: number, _manager?: EntityManager): Promise<WaitingQueue>;

  updateEntities(waitingQueues: WaitingQueuesEntity, _manager?: EntityManager);

  updateStatusByUserId(
    id: number,
    status: WaitingQueueStatus,
    _manager?: EntityManager,
  ): Promise<void>;
}
