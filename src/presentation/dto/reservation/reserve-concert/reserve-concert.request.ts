import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class ReserveConcertRequest {
  @IsNumber()
  @Min(1)
  userId: number;
  @IsNumber()
  @Min(1)
  concertId: number;
  @IsNumber()
  @Min(1)
  concertScheduleId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Type(() => Number)
  seatIds: number[];
}
