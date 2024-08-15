import ConcertScheduleStatus from "@app/domain/enum/entity/concert-seat-status.enum";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";

export class ConcertSeatEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  status: ConcertScheduleStatus;
  price: number;
  seat_number: number;
  schedule: ConcertScheduleEntity;
  version: number;
  constructor(
    args: Partial<{
      id: number;
      creat_at: Date;
      update_at: Date;
      status: ConcertScheduleStatus;
      price: number;
      seat_number: number;
      schedule: ConcertScheduleEntity;
      version: number;
    }>,
  ) {
    Object.assign(this, args);
  }
}
