import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import WaitingQueueEntity from "@app/domain/entity/waiting-queue.entity";

class WaitingQueuesEntity {
  constructor(private _waitingQueueList: WaitingQueueEntity[]) {}

  get waitingQueueList(): WaitingQueueEntity[] {
    return this._waitingQueueList;
  }

  set waitingQueueList(value: WaitingQueueEntity[]) {
    this._waitingQueueList = value;
  }

  isAvailable(): boolean {
    return this.getAvailableStatusLength() <= 9;
  }

  findByUserId(userId: number) {
    return this.waitingQueueList
      .filter((waitingQueue) => waitingQueue.user_id === userId)
      .map((waitingQueue) => waitingQueue.id);
  }

  checkWaitingQueues() {
    // 시간 지난 애들 만료 처리
    const now = new Date().getTime();
    let availableNum = 0;
    const _waitingQueueList = this.waitingQueueList.map((waitingQueue) => {
      const afterFifteenMin = waitingQueue.update_at.getTime() + 60 * 1000 * 15;
      // 지났으면 만료 처리
      if (now > afterFifteenMin) {
        waitingQueue.changeStatus(WaitingQueueStatus.EXPIRED);
      }

      if (waitingQueue.status === WaitingQueueStatus.AVAILABLE) {
        availableNum++;
      }
      // update_at 가 15분 안지났으면 통과
      return waitingQueue;
    });

    _waitingQueueList.sort((a, b) => a.id - b.id);

    // PENDING 앞번호 부터 AVAILABLE 처리
    let i = 0;
    while (true) {
      // 9보다 커지면 중단
      if (availableNum > 9) break;
      if (i >= _waitingQueueList.length) break;

      if (_waitingQueueList[i].status === WaitingQueueStatus.PENDING) {
        _waitingQueueList[i].changeStatus(WaitingQueueStatus.AVAILABLE);
        availableNum++;
      }
      i++;
    }

    // orderNum 새로 지정
    let orderNum = 1;
    for (let j = 0; j < _waitingQueueList.length; j++) {
      if (_waitingQueueList[j].status === WaitingQueueStatus.PENDING) {
        _waitingQueueList[j].changeOrderNum(orderNum++);
      }
    }

    this._waitingQueueList = _waitingQueueList;
  }

  private getAvailableStatusLength(): number {
    return this.waitingQueueList.filter(
      (waitingQueue) => waitingQueue.status === WaitingQueueStatus.AVAILABLE,
    ).length;
  }

  getPendingStatusLength(): number {
    return this.waitingQueueList.filter(
      (waitingQueue) => waitingQueue.status === WaitingQueueStatus.PENDING,
    ).length;
  }
}

export default WaitingQueuesEntity;
