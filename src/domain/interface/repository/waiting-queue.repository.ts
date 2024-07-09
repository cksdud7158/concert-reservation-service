import WaitingQueuesEntity from "@app/domain/entity/waiting-queues.entity";
import { WaitingQueue } from "@app/infrastructure/entity/waiting-queue.entity";
import WaitingQueueStatus from "@app/infrastructure/enum/waiting-queue-status.enum";
import { EntityManager } from "typeorm";

export const WaitingQueueRepositorySymbol = Symbol.for(
  "WaitingQueueRepository",
);

export interface WaitingQueueRepository {
  insert(
    userId: number,
    status: WaitingQueueStatus,
    _manager?: EntityManager,
  ): Promise<void>;

  findByStatusNotExpired(
    _manager?: EntityManager,
  ): Promise<WaitingQueuesEntity>;

  findByIdAndStatus(
    userId: number,
    status: WaitingQueueStatus,
    _manager?: EntityManager,
  ): Promise<WaitingQueue[]>;

  updateStatusToExpired(
    idList: number[],
    _manager?: EntityManager,
  ): Promise<void>;
}
