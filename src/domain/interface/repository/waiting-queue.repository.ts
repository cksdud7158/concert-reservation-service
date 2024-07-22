import WaitingQueuesEntity from "@app/domain/entity/waiting-queues.entity";

import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import { EntityManager } from "typeorm";
import WaitingQueueEntity from "@app/domain/entity/waiting-queue.entity";

export const WaitingQueueRepositorySymbol = Symbol.for(
  "WaitingQueueRepository",
);

export interface WaitingQueueRepository {
  save(
    waitingQueue: WaitingQueueEntity,
    _manager?: EntityManager,
  ): Promise<WaitingQueueEntity>;

  findByNotExpiredStatus(
    _manager?: EntityManager,
  ): Promise<WaitingQueuesEntity>;

  updateStatusToExpired(
    idList: number[],
    _manager?: EntityManager,
  ): Promise<void>;

  findOneById(
    id: number,
    _manager?: EntityManager,
  ): Promise<WaitingQueueEntity>;

  updateEntities(waitingQueues: WaitingQueuesEntity, _manager?: EntityManager);

  updateStatusByUserId(
    id: number,
    status: WaitingQueueStatus,
    _manager?: EntityManager,
  ): Promise<void>;
}
