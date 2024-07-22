import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";

class ConcertScheduleMapper {
  static toDomain(concertSchedule: ConcertSchedule): ConcertScheduleEntity {
    return new ConcertScheduleEntity(
      concertSchedule.id,
      concertSchedule.creat_at,
      concertSchedule.update_at,
      concertSchedule.date,
      concertSchedule.concert,
      concertSchedule.seats,
    );
  }
}

export default ConcertScheduleMapper;
