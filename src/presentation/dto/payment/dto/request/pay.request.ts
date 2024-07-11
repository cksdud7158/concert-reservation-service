import { IsInt } from "class-validator";

export class PayRequest {
  @IsInt()
  userId: number;
}
