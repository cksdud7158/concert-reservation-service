import TicketStatus from "@app/domain/enum/ticket-status.enum";
import { ConcertScheduleEntity } from "@app/domain/entity/concert-schedule.entity";
import { ConcertEntity } from "@app/domain/entity/concert.entity";
import { UserEntity } from "@app/domain/entity/user.entity";
import { ConcertSeatEntity } from "@app/domain/entity/concert-seat.entity";

export class TicketEntity {
  id: number;
  creat_at: Date;
  update_at: Date;
  status: TicketStatus;
  user: UserEntity;
  schedule: ConcertScheduleEntity;
  seat: ConcertSeatEntity;
  concert: ConcertEntity;

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
    }>,
  ) {
    Object.assign(this, args);
  }
}
