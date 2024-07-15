import { EntityManager } from "typeorm";
import { Ticket } from "@app/infrastructure/entity/ticket.entity";

export const TicketRepositorySymbol = Symbol.for("TicketRepository");

export interface TicketRepository {
  insert(
    userId: number,
    concertId: number,
    concertScheduleId: number,
    seatIds: number[],
    _manager?: EntityManager,
  ): Promise<number[]>;

  findByIds(ticketIds: number[], _manager?: EntityManager): Promise<Ticket[]>;
  findByIdsAndUserId(
    userId: number,
    ticketIds: number[],
    _manager?: EntityManager,
  ): Promise<Ticket[]>;
}
