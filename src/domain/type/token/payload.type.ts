import WaitingQueueEntity from "@app/domain/entity/waiting-queue.entity";

export type PayloadType = WaitingQueueEntity & {
  iat?: number;
  exp?: number;
};
