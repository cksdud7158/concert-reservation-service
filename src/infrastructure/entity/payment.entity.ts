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
import PaymentStatus from "@app/infrastructure/enum/payment-status.enum";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";
import { User } from "@app/infrastructure/entity/user.entity";

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: "timestamptz" })
  creat_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  update_at: Date;

  @Column({ default: 0 })
  price: number;

  @Column({
    type: "enum",
    enum: PaymentStatus,
    default: PaymentStatus.PAID,
  })
  status: PaymentStatus;

  @OneToMany(() => Ticket, (ticket) => ticket.id, {
    nullable: false,
  })
  @JoinColumn()
  tickets: Partial<Ticket[]>;

  @ManyToOne(() => User, (user) => user.id, {
    createForeignKeyConstraints: false,
    nullable: false,
  })
  @JoinColumn()
  user: Partial<User>;
}
