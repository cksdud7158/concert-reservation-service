import { ConcertScheduleEntity } from "@app/domain/entity/concert/concert-schedule.entity";

export class ConcertEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  name: string;
  schedules: ConcertScheduleEntity[];

  constructor(
    args: Partial<{
      id: number;
      creat_at: Date;
      update_at: Date;
      name: string;
      schedules: ConcertScheduleEntity[];
    }>,
  ) {
    Object.assign(this, args);
  }
}
