import { IsNumber, Min } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TokenRequest {
  @ApiProperty({ description: "유저 ID", example: 1, type: Number })
  @IsNumber()
  @Min(1)
  userId: number;
}
