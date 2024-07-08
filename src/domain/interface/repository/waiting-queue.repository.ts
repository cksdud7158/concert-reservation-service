import WaitingQueueStatus from "../../../infrastructure/enum/waiting-queue-status.enum";
import { EntityManager } from "typeorm";
import WaitingQueuesEntity from "../../entity/waiting-queues.entity";
import { WaitingQueue } from "../../../infrastructure/entity/waiting-queue.entity";

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
