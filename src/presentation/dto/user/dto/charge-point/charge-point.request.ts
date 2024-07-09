import { IsNumber, Min } from "class-validator";

export class ChargePointRequest {
  @IsNumber()
  @Min(1)
  amount: number;
}
