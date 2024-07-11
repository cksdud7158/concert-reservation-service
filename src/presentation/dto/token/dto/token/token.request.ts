import { IsInt } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class TokenRequest {
  @ApiProperty({ description: "유저 ID", example: 1, type: Number })
  @IsInt()
  userId: number;
}
