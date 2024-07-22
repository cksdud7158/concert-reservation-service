import WaitingQueueStatus from "@app/domain/enum/waiting-queue-status.enum";
import { BadRequestException } from "@nestjs/common";

class WaitingQueueEntity {
  constructor(
    private _id: number,
    private _creat_at: Date,
    private _update_at: Date,
    private _user_id: number,
    private _orderNum: number,
    private _status: WaitingQueueStatus,
  ) {}

  get id(): number {
    return this._id;
  }

  get creat_at(): Date {
    return this._creat_at;
  }

  get update_at(): Date {
    return this._update_at;
  }

  get user_id(): number {
    return this._user_id;
  }

  get orderNum(): number {
    return this._orderNum;
  }

  get status(): WaitingQueueStatus {
    return this._status;
  }

  updateUpdateAt(date: Date) {
    this._update_at = date;
  }

  changeStatus(status: WaitingQueueStatus) {
    this._status = status;
  }

  changeOrderNum(num: number) {
    if (num < 0) {
      throw new BadRequestException("음수는 허용되지않습니다.");
    }
    this._orderNum = num;
  }
}

export default WaitingQueueEntity;
