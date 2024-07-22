import { EntityManager } from "typeorm";
import { TicketEntity } from "@app/domain/entity/ticket.entity";

export const TicketRepositorySymbol = Symbol.for("TicketRepository");

export interface TicketRepository {
  insert(
    userId: number,
    concertId: number,
    concertScheduleId: number,
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<number[]>;

  findByIds(
    ticketIds: number[],
    _manager?: EntityManager,
  ): Promise<TicketEntity[]>;

  findByIdsAndUserId(
    userId: number,
    ticketIds: number[],
    _manager?: EntityManager,
  ): Promise<TicketEntity[]>;
}
