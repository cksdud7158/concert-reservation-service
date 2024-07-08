import { WaitingQueue } from "../../infrastructure/entity/waiting-queue.entity";
import WaitingQueueStatus from "../../infrastructure/enum/waiting-queue-status.enum";

class WaitingQueuesEntity {
  constructor(private readonly _waitingQueueList: WaitingQueue[]) {}

  get waitingQueueList(): WaitingQueue[] {
    return this._waitingQueueList;
  }

  create(userId: number) {
    let status: WaitingQueueStatus;
    // 활성 상태 10 명이 넘으면 대기로

    if (this.getAvailableStatusLength() > 9) {
      status = WaitingQueueStatus.PENDING;
    }
    // 안 넘으면 활성
    else {
      status = WaitingQueueStatus.AVAILABLE;
    }
    // 대기자 수 계산 해서 넘겨주기
    const orderNum = this.getPendingStatusLength();

    return { sub: userId, status, orderNum };
  }

  findById(userId: number) {
    return this._waitingQueueList
      .filter((waitingQueue) => waitingQueue.user_id === userId)
      .map((waitingQueue) => waitingQueue.id);
  }

  private getAvailableStatusLength(): number {
    return this._waitingQueueList.filter(
      (waitingQueue) => waitingQueue.status === WaitingQueueStatus.AVAILABLE,
    ).length;
  }

  private getPendingStatusLength(): number {
    return this._waitingQueueList.filter(
      (waitingQueue) => waitingQueue.status === WaitingQueueStatus.PENDING,
    ).length;
  }
}

export default WaitingQueuesEntity;
