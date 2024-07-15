import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import TicketStatus from "@app/infrastructure/enum/ticket-status.enum";
import { User } from "@app/infrastructure/entity/user.entity";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";
import { ConcertSeat } from "@app/infrastructure/entity/concert-seat.entity";
import { Concert } from "@app/infrastructure/entity/concert.entity";

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamptz" })
  creat_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  update_at: Date;

  @Column({
    type: "enum",
    enum: TicketStatus,
    default: TicketStatus.PENDING,
  })
  status: TicketStatus;

  @ManyToOne(() => User, (user) => user.id, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn()
  user: Partial<User>;

  @ManyToOne(() => ConcertSchedule, (schedule) => schedule.id, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn()
  schedule: Partial<ConcertSchedule>;

  @ManyToOne(() => ConcertSeat, (seat) => seat.id, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn()
  seat: Partial<ConcertSeat>;

  @ManyToOne(() => Concert, (concert) => concert.id, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn()
  concert: Partial<Concert>;
}
