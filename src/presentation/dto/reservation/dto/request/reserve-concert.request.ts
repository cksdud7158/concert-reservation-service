import { IsInt } from "class-validator";

export class ReserveConcertRequest {
  @IsInt()
  concertId: number;
  @IsInt()
  concertDataId: number;
  @IsInt()
  seatId: number;
}
