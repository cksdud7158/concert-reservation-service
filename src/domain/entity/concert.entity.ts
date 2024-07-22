import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";

export class ConcertEntity {
  id: number;

  creat_at: Date;
  update_at: Date;
  name: string;
  schedules?: ConcertScheduleEntity[];

  constructor(args: {
    id?: number;
    creat_at?: Date;
    update_at?: Date;
    name: string;
    schedules?: ConcertScheduleEntity[];
  }) {
    Object.assign(this, args);
  }
}
