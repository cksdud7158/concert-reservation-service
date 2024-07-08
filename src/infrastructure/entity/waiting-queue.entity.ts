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

  @CreateDateColumn({ type: "timestamp" })
  creat_at: number;

  @UpdateDateColumn({ type: "timestamp" })
  update_at: number;

  @Column()
  user_id: number;

  @Column({
    type: "enum",
    enum: WaitingQueueStatus,
    default: WaitingQueueStatus.EXPIRED,
  })
  status: WaitingQueueStatus;
}
