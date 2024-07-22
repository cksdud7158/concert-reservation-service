import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import { BadRequestException } from "@nestjs/common";

class WaitingQueueEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  user_id: number;
  orderNum: number;
  status: WaitingQueueStatus;
  constructor(args: {
    id?: number;
    creat_at?: Date;
    update_at?: Date;
    user_id: number;
    orderNum: number;
    status: WaitingQueueStatus;
  }) {
    Object.assign(this, args);
  }

  updateUpdateAt(date: Date) {
    this.update_at = date;
  }

  changeStatus(status: WaitingQueueStatus) {
    this.status = status;
  }

  changeOrderNum(num: number) {
    if (num < 0) {
      throw new BadRequestException("음수는 허용되지않습니다.");
    }
    this.orderNum = num;
  }
}

export default WaitingQueueEntity;
