import WaitingQueueEntity from "@app/domain/entity/waitingQueue/waiting-queue.entity";

export type PayloadType = WaitingQueueEntity & {
  iat?: number;
  exp?: number;
};
