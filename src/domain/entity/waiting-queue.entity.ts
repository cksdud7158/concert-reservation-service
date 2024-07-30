import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";

class WaitingQueueEntity {
  userId: number;
  orderNum: number;
  status: WaitingQueueStatus;

  constructor(
    args: Partial<{
      userId: number;
      orderNum: number;
      status: WaitingQueueStatus;
    }>,
  ) {
    Object.assign(this, args);
  }
}

export default WaitingQueueEntity;
