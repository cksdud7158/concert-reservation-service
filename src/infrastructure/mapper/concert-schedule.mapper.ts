import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";
import ConcertMapper from "@app/infrastructure/mapper/concert.mapper";
import ConcertSeatMapper from "@app/infrastructure/mapper/concert-seat.mapper";

class ConcertScheduleMapper {
  static toDomain(concertSchedule: ConcertSchedule): ConcertScheduleEntity {
    return new ConcertScheduleEntity({
      id: concertSchedule.id,
      creat_at: concertSchedule.creat_at,
      update_at: concertSchedule.update_at,
      date: concertSchedule.date,
      concert: ConcertMapper.toDomain(concertSchedule.concert),
      seats: concertSchedule.seats.map((seat) =>
        ConcertSeatMapper.toDomain(seat),
      ),
    });
  }
}

export default ConcertScheduleMapper;
