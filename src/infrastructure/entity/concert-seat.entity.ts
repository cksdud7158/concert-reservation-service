import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from "typeorm";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import ConcertScheduleStatus from "@app/domain/enum/entity/concert-seat-status.enum";

@Entity()
export class ConcertSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamptz" })
  creat_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  update_at: Date;

  @ManyToOne(
    () => ConcertSchedule,
    (concertSchedule) => concertSchedule.seats,
    {
      createForeignKeyConstraints: false,
      nullable: false,
    },
  )
  @JoinColumn()
  schedule: ConcertSchedule;

  @Column({
    type: "enum",
    enum: ConcertScheduleStatus,
    default: ConcertScheduleStatus.SALE,
  })
  status: ConcertScheduleStatus;

  @Column({ type: "integer", nullable: false })
  price: number;

  @Column({ type: "integer", nullable: false })
  seat_number: number;

  @VersionColumn()
  version: number;
}
