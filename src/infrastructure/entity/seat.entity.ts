import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import ConcertSeatStatusEnum from "@app/infrastructure/enum/concert-seat-status.enum";

@Entity()
export class Seat {
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
    enum: ConcertSeatStatusEnum,
    default: ConcertSeatStatusEnum.SALE,
  })
  status: ConcertSeatStatusEnum;

  @Column({ type: "integer", nullable: false })
  price: number;

  @Column({ type: "integer", nullable: false })
  seat_number: number;
}
