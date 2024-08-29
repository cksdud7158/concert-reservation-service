import { isNumber } from "class-validator";
import { BadRequestException } from "@nestjs/common";

class PointEntity {
  private _point;
  constructor(
    args: Partial<{
      point: number;
    }>,
  ) {
    if (!isNumber(args.point)) {
      throw new BadRequestException("없는 유저입니다.");
    }

    this._point = args.point;
  }

  get point(): number {
    return this._point;
  }
  set point(value: number) {
    this._point = value;
  }

  add(amount: number) {
    this.point += amount;
  }

  use(amount: number) {
    if (amount > this.point) {
      throw new BadRequestException("잔액이 부족합니다.");
    }
    this.point -= amount;
  }
}

export default PointEntity;
