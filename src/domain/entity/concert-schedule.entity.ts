import { ConcertEntity } from "@app/domain/entity/concert.entity";
import { ConcertSeatEntity } from "@app/domain/entity/concert-seat.entity";

export class ConcertScheduleEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  date: Date;
  concert?: ConcertEntity;
  seats?: ConcertSeatEntity[];
  constructor(args: {
    id?: number;
    creat_at?: Date;
    update_at?: Date;
    date: Date;
    concert?: ConcertEntity;

    seats?: ConcertSeatEntity[];
  }) {
    Object.assign(this, args);
  }
}
