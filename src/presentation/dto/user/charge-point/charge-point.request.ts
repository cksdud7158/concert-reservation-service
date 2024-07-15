import { IsNumber, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ChargePointRequest {
  @ApiProperty({ description: "충전할 point", example: 1000, type: Number })
  @IsNumber()
  @Min(1)
  amount: number;
}
