import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import WaitingQueueStatus from "../enum/waiting-queue-status.enum";

@Entity()
export class WaitingQueue {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamptz" })
  creat_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  update_at: Date;

  @Column()
  user_id: number;

  @Column({ type: "integer", default: 0 })
  orderNum: number;

  @Column({
    type: "enum",
    enum: WaitingQueueStatus,
    default: WaitingQueueStatus.EXPIRED,
  })
  status: WaitingQueueStatus;
}
