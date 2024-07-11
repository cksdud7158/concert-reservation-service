import { ApiProperty } from "@nestjs/swagger";

export class ChargePointResponse {
  @ApiProperty({ example: 1000, minimum: 0 })
  balance: number;
}
