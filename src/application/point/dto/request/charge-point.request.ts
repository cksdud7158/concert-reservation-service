import { IsInt } from "class-validator";

export class ChargePointRequest {
  @IsInt()
  amount: number;
}
