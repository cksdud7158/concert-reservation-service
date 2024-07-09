import { isNumber } from "class-validator";
import { BadRequestException } from "@nestjs/common";

class PointEntity {
  constructor(private _point: number) {
    if (!isNumber(_point)) {
      throw new BadRequestException("없는 유저입니다.");
    }
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
}

export default PointEntity;
