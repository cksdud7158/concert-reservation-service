import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  Min,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

export class ReserveConcertRequest {
  @ApiProperty({ example: 1, minimum: 0 })
  @IsNumber()
  @Min(1)
  userId: number;

  @ApiProperty({ example: 1, minimum: 0 })
  @IsNumber()
  @Min(1)
  concertId: number;

  @ApiProperty({ example: 1, minimum: 0 })
  @IsNumber()
  @Min(1)
  concertScheduleId: number;

  @ApiProperty({ example: [1, 2, 3] })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Type(() => Number)
  seatIds: number[];
}
