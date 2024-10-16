import { ConcertEntity } from "@app/domain/entity/concert/concert.entity";
import { ConcertSeatEntity } from "@app/domain/entity/concert/concert-seat.entity";

export class ConcertScheduleEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  date: Date;
  concert: ConcertEntity;
  seats: ConcertSeatEntity[];
  constructor(
    args: Partial<{
      id: number;
      creat_at: Date;
      update_at: Date;
      date: Date;
      concert: ConcertEntity;
      seats: ConcertSeatEntity[];
    }>,
  ) {
    Object.assign(this, args);
  }
}
