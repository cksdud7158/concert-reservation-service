import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { ConcertSchedule } from "@app/infrastructure/entity/concert-schedule.entity";

@Entity()
export class Concert {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamptz" })
  creat_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  update_at: Date;

  @Column({ type: "text" })
  name: string;

  @OneToMany(() => ConcertSchedule, (schedule) => schedule.concert)
  @JoinColumn()
  schedules: Partial<ConcertSchedule[]>;
}
