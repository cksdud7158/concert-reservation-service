import ConcertScheduleStatus from "@app/domain/enum/concert-seat-status.enum";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";

export class ConcertSeatEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  status: ConcertScheduleStatus;
  price: number;
  seat_number: number;
  schedule?: ConcertScheduleEntity;
  constructor(args: {
    id?: number;
    creat_at?: Date;
    update_at?: Date;
    status: ConcertScheduleStatus;
    price: number;
    seat_number: number;
    schedule?: ConcertScheduleEntity;
  }) {
    Object.assign(this, args);
  }
}
