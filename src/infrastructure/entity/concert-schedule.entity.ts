import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Concert } from "@app/infrastructure/entity/concert.entity";
import { Seat } from "@app/infrastructure/entity/seat.entity";

@Entity()
export class ConcertSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamptz" })
  creat_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  update_at: Date;

  @Column({ type: "timestamptz" })
  date: Date;

  @ManyToOne(() => Concert, (concert) => concert.schedules, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn()
  concert: Concert;

  @OneToMany(() => Seat, (seat) => seat.schedule)
  @JoinColumn()
  seats: Seat[];
}
