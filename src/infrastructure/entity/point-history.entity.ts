import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "@app/infrastructure/entity/user.entity";
import PointHistoryType from "@app/domain/enum/point-history.enum";

@Entity()
export class PointHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamptz" })
  creat_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  update_at: Date;

  @Column({ type: "integer" })
  amount: number;

  @Column({ type: "integer" })
  balance: number;

  @ManyToOne(() => User, (user) => user.id, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn()
  user: User;

  @Column({
    type: "enum",
    enum: PointHistoryType,
  })
  type: PointHistoryType;
}
