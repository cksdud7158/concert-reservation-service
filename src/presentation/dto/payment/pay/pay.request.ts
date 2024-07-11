import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class PayRequest {
  @IsNumber()
  @Min(1)
  userId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  @Type(() => Number)
  ticketIds: number[];
}
