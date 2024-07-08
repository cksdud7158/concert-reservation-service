import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamp" })
  creat_at: number;

  @UpdateDateColumn({ type: "timestamp" })
  update_at: number;

  @Column({ default: 0 })
  point: number;
}
