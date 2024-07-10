import { ApiProperty } from "@nestjs/swagger";
import ConcertScheduleStatus from "@app/infrastructure/enum/concert-seat-status.enum";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";

const schedulesExample = [
  {
    id: 1,
    date: 12321345,
    isSoldOut: false,
  },
];

export class GetSeatListResponse {
  @ApiProperty({ example: 10, minimum: 0 })
  total: number;

  @ApiProperty({ example: schedulesExample })
  seats: {
    id: number;
    seatNum: number;
    status: ConcertScheduleStatus;
    price: number;
  }[];

  static toResponse(
    concertSeatList: Partial<ConcertSeat>[],
  ): GetSeatListResponse {
    return {
      total: concertSeatList.length,
      seats: concertSeatList.map((seat) => ({
        id: seat.id,
        seatNum: seat.seat_number,
        price: seat.price,
        status: seat.status,
      })),
    };
  }
}
