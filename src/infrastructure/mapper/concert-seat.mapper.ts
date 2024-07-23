import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { ConcertSeatEntity } from "@app/domain/entity/concert-seat.entity";
import ConcertScheduleMapper from "@app/infrastructure/mapper/concert-schedule.mapper";

class ConcertSeatMapper {
  static toDomain(concertSeat: ConcertSeat): ConcertSeatEntity {
    return new ConcertSeatEntity({
      id: concertSeat.id,
      creat_at: concertSeat.creat_at,
      update_at: concertSeat.update_at,
      status: concertSeat.status,
      price: concertSeat.price,
      seat_number: concertSeat.seat_number,
      schedule: concertSeat.schedule
        ? ConcertScheduleMapper.toDomain(concertSeat.schedule)
        : null,
      version: concertSeat.version,
    });
  }
}

export default ConcertSeatMapper;
