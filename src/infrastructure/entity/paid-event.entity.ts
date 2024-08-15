import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

import PaidEventStatus from "@app/domain/enum/entity/paid-event-status.enum";
import { MessageType } from "@app/domain/type/message/producer.type";

@Entity()
export class PaidEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamptz" })
  creat_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  update_at: Date;

  @Column({
    type: "enum",
    enum: PaidEventStatus,
    default: PaidEventStatus.INIT,
  })
  status: PaidEventStatus;

  @Column({ type: "text" })
  message: MessageType;
}
