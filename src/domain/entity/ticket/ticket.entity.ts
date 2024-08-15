import TicketStatus from "@app/domain/enum/entity/ticket-status.enum";
import { ConcertScheduleEntity } from "@app/domain/entity/concert/concert-schedule.entity";
import { ConcertEntity } from "@app/domain/entity/concert/concert.entity";
import { UserEntity } from "@app/domain/entity/user/user.entity";
import { ConcertSeatEntity } from "@app/domain/entity/concert/concert-seat.entity";

export class TicketEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  status: TicketStatus;
  user: UserEntity;
  schedule: ConcertScheduleEntity;
  seat: ConcertSeatEntity;
  concert: ConcertEntity;
  version: number;

  constructor(
    args: Partial<{
      id: number;
      creat_at: Date;
      update_at: Date;
      status: TicketStatus;
      user: UserEntity;
      schedule: ConcertScheduleEntity;
      seat: ConcertSeatEntity;
      concert: ConcertEntity;
      version: number;
    }>,
  ) {
    Object.assign(this, args);
  }
}
